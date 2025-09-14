import User from "../../../models/auth.model.js"
import { generateToken } from "../../../utils/jwtHelper.js";
import httpStatus from "http-status";
import {comparePassword } from "../../../utils/passwordHelper.js";


export default class AuthService {
 
  static async login(reqBody) {
    const { email, password } = reqBody;

    const user = await User.findOne({ email,role:"ADMIN" });
    if (!user) {
      throw new AppError({
        message: "User not found",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }

    const isCorrectPassword = await comparePassword(password, user.password);
    if (!isCorrectPassword) {
      throw new AppError({
        message: "Password incorrect",
        httpStatus: httpStatus.UNAUTHORIZED,
      });
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.email, user.role),
    };
  }

}


