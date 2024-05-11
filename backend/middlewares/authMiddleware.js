import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import asyncHandler from "./asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userID).select("-password");
      next();
    } catch (error) {
      res.status(401).json(new ApiError(401, "Not authorized, token failed"));
    }
  } else {
    res.status(401).json(new ApiError(401, "Token not found, Unauthorized!!!"));
  }
});
//for admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json(new ApiError(401, "Not authorized as an admin"));
  }
};

export { authenticate, authorizeAdmin };
