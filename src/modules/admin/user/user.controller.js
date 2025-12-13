import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import httpStatus from "http-status";
import UserService from "./user.service.js"
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class UserController {
  static listUsers = asyncHandler(async (req, res) => {
    const data = await UserService.listUsers(req.query);
    return sendSuccess(
      res,
      data,
      "Users fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static getUserDetails = asyncHandler(async (req, res) => {
    const data = await UserService.getUserDetails(req.params.id);
    return sendSuccess(
      res,
      data,
      "User details fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static getChildDetails = asyncHandler(async (req, res) => {
    const data = await UserService.getChildDetails(
      req.query.page,
      req.query.limit,
      req.params.id
    );
    return sendSuccess(
      res,
      data,
      "Child details fetched successfully",
      HTTPStatusCode.OK
    );
  });

  // Add Admin
  static addAdmin = asyncHandler(async (req, res) => {
    req.body.avatar = req.body?.avatar;

    const data = await UserService.addAdmin(req.body);
    return sendSuccess(
      res,
      data,
      "Admin created successfully",
      HTTPStatusCode.CREATED
    );
  });

  // List Admins
  static listAdmins = asyncHandler(async (req, res) => {
    const data = await UserService.listAdmins(req.query);
    return sendSuccess(res, data, "Admin list fetched successfully");
  });

  // Admin Details
  static getAdminDetail = asyncHandler(async (req, res) => {
    const data = await UserService.getAdminDetail(req.params.id);
    return sendSuccess(res, data, "Admin details fetched successfully");
  });

  // Edit Admin
  static editAdmin = asyncHandler(async (req, res) => {
    req.body.avatar = req.body?.avatar;
    const data = await UserService.editAdmin(req.params.id, req.body);
    return sendSuccess(res, data, "Admin updated successfully");
  });

  // Delete Admin
  static deleteAdmin = asyncHandler(async (req, res) => {
    const data = await UserService.deleteAdmin(req.params.id);
    return sendSuccess(res, data, "Admin deleted successfully");
  });

  static updateUserStatus = asyncHandler(async (req, res) => {
    const data = await UserService.updateUserStatus(req.params.id);
    return sendSuccess(
      res,
      data,
      "User Status Updated successfully",
      HTTPStatusCode.OK
    );
  });
}
