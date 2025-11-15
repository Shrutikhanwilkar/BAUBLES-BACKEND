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
    console.log(req.user);
    const data = await CommonService.getProfile(req.user.id);
    return sendSuccess(
      res,
      data,
      "Admin profile fetched successfully",
      HTTPStatusCode.OK
    );
  });
  static updateProfile = asyncHandler(async (req, res) => {
    const avatarUrl = req.body.avatar;
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
  static uploadDashboardVedio = asyncHandler(async (req, res) => {
    const avatarUrl = req.body.videoFile;

    const payload = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      status: req.body.status,
    };

    const data = await CommonService.uploadDashboardVedio(avatarUrl, payload);

    return sendSuccess(
      res,
      data,
      "Dashboard video uploaded successfully",
      HTTPStatusCode.OK
    );
  });

  // GET ALL
  static getAllDashboardVideos = asyncHandler(async (req, res) => {
    const videos = await CommonService.getAllDashboardVideos();

    return sendSuccess(
      res,
      videos,
      "All dashboard videos fetched",
      HTTPStatusCode.OK
    );
  });

  static updateDashboardVideo = asyncHandler(async (req, res) => {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      status: req.body.status,
    };

    const updated = await CommonService.updateDashboardVideo(
      req.params.id,
      payload
    );

    return sendSuccess(
      res,
      updated,
      "Dashboard video updated successfully",
      HTTPStatusCode.OK
    );
  });

  // DELETE
  static deleteDashboardVideo = asyncHandler(async (req, res) => {
    await CommonService.deleteDashboardVideo(req.params.id);

    return sendSuccess(
      res,
      null,
      "Dashboard video deleted successfully",
      HTTPStatusCode.OK
    );
  });
}
