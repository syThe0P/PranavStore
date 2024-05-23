import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendToken from "../utils/createToken.js";
import { sendEmail } from "../utils/sendEmail.js";

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "sampleimg.png",
    },
  });

  sendToken(user, 200, res);
  res.json({
    message: "User created succesfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  if (!email || !password) {
    throw new ApiError(400, "Please enter email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const passwordCheck = user.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(400, "Invalid credentials");
  }

  sendToken(user, 200, res);
  res.json({
    message: "User loged in succesfully",
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.json(new ApiResponse(200, "User Logedout Succesfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //Get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}   \n\n If you have not requested this link plz ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Eccomerce Password Recovery`,
      message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
  }
});

//ResetPassword
const resetPassword = asyncHandler(async (req, res) => {

  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()},
    })

    if(!user){
      throw new ApiError(404, "Reset password token is invalid or has been expired")
    }
    if(req.body.password !== req.body.confirmPassword){
        throw new ApiError(400, "Password does not match")
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200, res);
    res.json({
      message:"Password reseted and logged in"
    })


});

export { registerUser, loginUser, logoutUser, forgotPassword, resetPassword };
