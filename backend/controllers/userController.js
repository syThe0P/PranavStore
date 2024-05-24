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

//login user
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

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.json(new ApiResponse(200, "User Logedout Succesfully"));
});

//forgot password
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
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(
      404,
      "Reset password token is invalid or has been expired"
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    throw new ApiError(400, "Password does not match");
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
  res.json({
    message: "Password reseted and logged in",
  });
});

//Get User Details
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(new ApiResponse(200, user, "User Details"));
});


//Update user Password
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.isPasswordCorrect(req.body.oldPassword);
  if (!isPasswordMatched) {
    throw new ApiError(401, "Old Password not matched");
  }

  if (!req.body.newPassword !== req.body.confirmPassword) {
    throw new ApiError(400, "Password does not matched");
  }

  user.password = newPassword;

  await user.save();
  sendToken(user, 200, res);
  res.json({
    message: "Password changes",
  });
});


//Update user profile
const updateProfile = asyncHandler(async(req, res)=>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  }
  //We will do avatar later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.json(new ApiResponse(
    200,
    user,
    "User Updated Succesfully"
  ))
})


//Get all Users --- ADMIN
const getAllUsers = asyncHandler(async(req, res)=>{
    const users = await User.find({});

    res.json(new ApiResponse(
      200,
      users,
      "All users are displayed"
    ))
})


//Get single user --ADMIN
const getUserByID = asyncHandler(async(req,res) =>{
  const user = await User.findById(req.params.id);
  if(!user){
    throw new ApiError(401, "User not found");
  }

  res.json(new ApiResponse(
    200,
    user,
    "User recieved by admin"
  ))
})

//Update user through admin --- ADMIN
const updateUserByID = asyncHandler(async(req, res) =>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }
  //We will do avatar later

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.json(new ApiResponse(
    200,
    user,
    "User Updated Succesfully"
  ))
})


//Delete user --- ADMIN
const deleteUser = asyncHandler(async(req, res) =>{
    const user = await User.findById(req.params.id);
    if(!user) throw new ApiError(401, "User not found")
    await user.remove();

    res.json(new ApiResponse(
      200,
      `User With id -> ${req.params.id} is removed!!`
    ))
    //We will also remove cloudinary

})

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserByID,
  updateUserByID,
  deleteUser
};
