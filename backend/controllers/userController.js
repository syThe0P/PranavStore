import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation: Check if all required fields are present and not empty
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exists
  const existedUser = await User.findOne({ $or: [{ name }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Handle avatar upload if needed
  let avatarUrl = "";
  let avatarPublicId = "";
  if (req.files && req.files.avatar) {
    const avatarLocalPath = req.files.avatar[0].path;
    const avatarUploadResult = await uploadCloudinary(avatarLocalPath);
    avatarUrl = avatarUploadResult.url;
    avatarPublicId = avatarUploadResult.public_id;
  }

  // Create user object in the database
  const user = await User.create({
    name,
    avatar: {
      public_id: avatarPublicId,
      url: avatarUrl,
    },
    email,
    password,
  });

  // Retrieve the created user without password and refresh token fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict",
  };

  // Return the response
  return res
  .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Ensure email and password are provided
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find the user by email and include the password field
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check if the provided password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);

  // Handle invalid password
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  // Remove the password and refreshToken fields before sending the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set options for the cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict",
  };

  // Send the response with cookies and user information
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  // res.cookie("jwt", "",options);
  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.json(new ApiResponse(404, "User not found"));
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json(
      new ApiResponse(
        201,
        {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
        "User updated successfully"
      )
    );
  } else {
    res.status(404);
    throw new ApiError(404, "User not found");
  }
});

const deleteById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.json(new ApiResponse(400, "Cannot delete an admin"));
    }
    await user.deleteOne({ _id: user._id });
    res.json(new ApiResponse(201, "User removed"));
  } else {
    res.status(404);
    throw new ApiError(404, "User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(
      new ApiResponse(
        201,
        {
          user,
        },
        "User from admin route"
      )
    );
  } else {
    res.status(401);
    throw new ApiError(401, "User could not be retrieved");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json(
      new ApiResponse(
        201,
        {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
        "User updated successfully by admin"
      )
    );
  } else {
    res.status(404);
    throw new ApiError(404, "User not found");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteById,
  getUserById,
  updateUserById,
};
