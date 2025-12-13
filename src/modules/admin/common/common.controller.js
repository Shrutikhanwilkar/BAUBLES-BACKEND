import { sendSuccess } from "../../../utils/responseHelper.js";
import CommonService from "./common.service.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import asyncHandler from "../../../utils/asyncHandler.js";
export default class CommonController {
  static getDashboardStats = asyncHandler(async (req, res) => {
    const data = await CommonService.getDashboardStats();
    return sendSuccess(
      res,
      data,
      "Dashboard stats fetched successfully",
      HTTPStatusCode.OK
    );
  });
  static getProfile = asyncHandler(async (req, res) => {
    const data = await CommonService.getProfile(req.user.id);
    return sendSuccess(
      res,
      data,
      "Admin profile fetched successfully",
      HTTPStatusCode.OK
    );
  });
  static updateProfile = asyncHandler(async (req, res) => {
    // const avatarUrl = req.body.avatar;
    const data = await CommonService.updateProfile(req.user.id, req.body);
    return sendSuccess(
      res,
      data,
      "Admin profile updated successfully",
      HTTPStatusCode.OK
    );
  });
  static changePassword = asyncHandler(async (req, res) => {
    const data = await CommonService.changePassword(req.user.id, req.body);
    return sendSuccess(
      res,
      data,
      "Password changed successfully",
      HTTPStatusCode.OK
    );
  });
  static uploadAvatar = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const avatarUrl = req.body.avatar;
    const data = await CommonService.uploadAvatar(id, avatarUrl);
    return sendSuccess(
      res,
      data,
      "Avatar uploaded successfully",
      HTTPStatusCode.OK
    );
  });
  static addDashboardVedio = asyncHandler(async (req, res) => {
    const data = await CommonService.addDashboardVedio(req.body);
    return sendSuccess(
      res,
      data,
      "Dashboard link uploaded successfully",
      HTTPStatusCode.OK
    );
  });
  static appVerisonUpdate = asyncHandler(async (req, res) => {
    const data = await CommonService.appVerisonUpdate(req.body);
    return sendSuccess(res, data, "Version updated successfully");
  });

  static appVersion = asyncHandler(async (req, res) => {
    const data = await CommonService.appVersion();
    return sendSuccess(res, data, "Version fetched successfully");
  });

  static sendBroadcastToAll = asyncHandler(async (req, res) => {
    const data = await CommonService.sendBroadcastToAll(req.body);
    return sendSuccess(res, data, "Broadcast sent successfully");
  });

  static broadcastHistory = asyncHandler(async (req, res) => {
    const data = await CommonService.broadcastHistory();
    return sendSuccess(res, data, "Broadcast fetched successfully");
  });
}
