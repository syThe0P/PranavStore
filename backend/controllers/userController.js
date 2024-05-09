import User from '../models/UserModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'


const createUser = asyncHandler(async (req, res)=>{
    res.send("Hello");
})


export {createUser};