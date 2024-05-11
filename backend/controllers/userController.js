import User from "../models/UserModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(401, "Please fill all the details");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(401, "User Already Exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  const token = generateToken(newUser._id);

  // Set JWT as an HTTP-only cookie
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
  res.cookie("jwt", token, options);

  res.status(201).json(
    new ApiResponse(
      200,
      {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      "User registered Succesfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      const token = generateToken(existingUser._id);

      // Set JWT as an HTTP-only cookie
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      };
      res.cookie("jwt", token, options);
      res.status(201).json(
        new ApiResponse(
          200,
          {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
          },
          "User logged in successfully"
        )
      );
      return;
    }
    res.status(401).json(new ApiResponse(401, null, "Password is incorrect"));
  }

  // If user is not found or password is invalid
  res
    .status(401)
    .json(new ApiResponse(401, null, "User not found or invalid credentials"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(201).json(new ApiResponse(201, "User Logged out successfully"));
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
  const user =await User.findById(req.user._id);
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

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
