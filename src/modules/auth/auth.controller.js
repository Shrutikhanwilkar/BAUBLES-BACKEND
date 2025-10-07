import { AuthService } from "./auth.service.js";
const authService = new AuthService();
import { sendSuccess } from "../../utils/responseHelper.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import asyncHandler from "../../utils/asyncHandler.js";

export class AuthController {
  register = asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    sendSuccess(res, data, "User Registered Successfully", HTTPStatusCode.CREATED);
  });

  login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    sendSuccess(res, data, "Login Successful", HTTPStatusCode.OK);
  });

  verifyOtp = asyncHandler(async (req, res) => {
    const data = await authService.verifyOtp(req.body);
    sendSuccess(res, data, "Verified", HTTPStatusCode.OK);
  });

  resendOtp = asyncHandler(async (req, res) => {
    const data = await authService.resendOtp(req.body);
    sendSuccess(res, data, "Otp Resent Successfully", HTTPStatusCode.OK);
  });

  changePassword = asyncHandler(async (req, res) => {
    const data = await authService.changePassword(req.body);
    sendSuccess(res, data, "Password Changed Successfully", HTTPStatusCode.OK);
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const data = await authService.forgotPassword(req.body);
    sendSuccess(res, data, "Password Reset Successfully", HTTPStatusCode.OK);
  });
}
