import jwt from "jsonwebtoken";

const generateToken = (userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Return the token instead of setting cookies here
  return token;
};

export default generateToken;
