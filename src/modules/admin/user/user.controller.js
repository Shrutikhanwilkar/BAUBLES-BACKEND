import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import httpStatus from "http-status";
import UserService from "./user.service.js"

export default class UserController {
  
    static listUsers = asyncHandler(async (req, res) => {
        const data = await UserService.listUsers(req.query);
        return sendSuccess(res, data, "Users fetched successfully", httpStatus.OK);
    });

    static getUserDetails = asyncHandler(async (req, res) => {
        const data = await UserService.getUserDetails(req.params.id);
        return sendSuccess(res, data, "User details fetched successfully", httpStatus.OK);
    });
}
