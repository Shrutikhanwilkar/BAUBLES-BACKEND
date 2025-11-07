import User from "../../../models/auth.model.js"
import { generateToken } from "../../../utils/jwtHelper.js";
import httpStatus from "http-status";
import {comparePassword } from "../../../utils/passwordHelper.js";
import AppError from "../../../utils/appError.js";
import { hashPassword } from "../../../utils/passwordHelper.js";


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

  static async getProfile(adminId) {
    const admin = await User.findOne({ _id: adminId, role: "ADMIN" }).select("-password -otp -otpExpiredAt");
    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin profile not found",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }
    return admin;
  }
  static async updateProfile(adminId, reqBody) {
    const admin = await User.findOneAndUpdate(
      { _id: adminId, role: "ADMIN" },
      reqBody,
      { new: true, runValidators: true, select: "-password -otp -otpExpiredAt" }
    );

    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin not found or unauthorized",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }

    return admin;
  }
  static async changePassword(adminId, { oldPassword, newPassword }) {
    const admin = await User.findOne({ _id: adminId, role: "ADMIN" });
    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin not found",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }

    const isMatch = await comparePassword(oldPassword, admin.password);
    if (!isMatch) {
      throw new AppError({
        status: false,
        message: "Old password is incorrect",
        httpStatus: httpStatus.UNAUTHORIZED,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();

    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      message: "Password updated successfully",
    };
  }

}


