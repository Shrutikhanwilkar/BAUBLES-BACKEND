import { AuthService } from "./auth.service.js";
const authService = new AuthService();
import { sendSuccess, sendError } from "../../utils/responseHelper.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";

export class AuthController {
  async register(req, res) {
    try {
      console.log("helooo")
      const data = await authService.register(req.body);
      sendSuccess(
        res,
        data,
        "User Registered Successfully",
        HTTPStatusCode.CREATED
      );
    } catch (error) {
      sendError(res, error.message, HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async login(req, res) {
    try {
      const data = await authService.login(req.body);
      sendSuccess(res, data, "Login Successful", HTTPStatusCode.OK);
    } catch (error) {
      sendError(res, error.message, HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOtp(req, res) {
    try {
      const data = await authService.verifyOtp(req.body);
      sendSuccess(
        res,
        data,
        "Verified",
        HTTPStatusCode.OK
      );
    } catch (error) {
      sendError(res, error.message, HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async resendOtp(req, res) {
    try {
      const data = await authService.resendOtp(req.body);
      sendSuccess(res, data, "Otp Resend Successfully", HTTPStatusCode.OK);
    } catch (error) {
      sendError(res, error.message, HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(req, res) {
    try { 
      const data = await authService.changePassword(req.body);
      sendSuccess(
        res,
        data,
        "Password Changed Successfully",
        HTTPStatusCode.OK
      );
    } catch (error) {
      sendError(res, error.message, HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(req, res) {
    try {
      const data = await authService.forgotPassword(req.body);
      sendSuccess(res, data, "Success", HTTPStatusCode.OK);
    } catch (error) {
      sendError(res, error.message, HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
  }
}
