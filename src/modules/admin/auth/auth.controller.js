import AuthService from "./auth.service.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import httpStatus from "http-status";

export default class AuthController {
  static login = asyncHandler(async (req, res) => {
    const data = await AuthService.login(req.body);
    return sendSuccess(res, data, "Login successful",httpStatus.OK);
  });
  static getProfile = asyncHandler(async (req, res) => {
    console.log(req.user)
    const data = await AuthService.getProfile(req.user.id);
    return sendSuccess(res, data, "Admin profile fetched successfully", httpStatus.OK);
  });
  static updateProfile = asyncHandler(async (req, res) => {
    const avatarUrl = req.body.avatar;
    const data = await AuthService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, data, "Admin profile updated successfully", httpStatus.OK);
  });
  static changePassword = asyncHandler(async (req, res) => {
    const data = await AuthService.changePassword(req.user.id, req.body);
    return sendSuccess(res, data, "Password changed successfully", httpStatus.OK);
  });
}
