import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import asyncHandler from "./asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


//check user authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
  try {
    const {token} = req.cookies || req.header("Authorization")?.replace("Bearer ", "")
    
    // console.log(token);
    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

    const user = await User.findById(decodedToken?.id)

    if (!user) {
        
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}
});


//Check for admin
const authorizeRoles = (...roles) => {
    return(req, res, next) =>{
        if(!roles.includes(req.user.role)){
            throw new ApiError(401, "You are not allowed to access this resource")
        }
        next();
    }
}


export { authenticate,authorizeRoles };
