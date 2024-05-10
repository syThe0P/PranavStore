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

export { createUser };
