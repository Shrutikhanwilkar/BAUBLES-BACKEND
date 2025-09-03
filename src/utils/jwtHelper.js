import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config()
export const generateToken = (id,email,role) => {
  return jwt.sign({ id ,email,role}, process.env.JWT_SECRET , {
    expiresIn: "30d",
  });
};
