//Creating token and saving in cookie
import { ApiResponse } from "./ApiResponse.js"

const sendToken = (user, statuCode, res) =>{
  const token = user.getJwtToken()
  //options for cookes

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  res.status(statuCode).cookie('token',token,options).json(new ApiResponse(
    statuCode,
    user,
    token,
  ))
}

export default sendToken;