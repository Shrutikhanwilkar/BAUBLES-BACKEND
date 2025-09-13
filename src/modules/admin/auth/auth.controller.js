import AuthService from "./auth.service.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import httpStatus from "http-status";

export default class AuthController {
  static login = asyncHandler(async (req, res) => {
    const data = await AuthService.login(req.body);
    return sendSuccess(res, data, "Login successful",httpStatus.OK);
  });
}
