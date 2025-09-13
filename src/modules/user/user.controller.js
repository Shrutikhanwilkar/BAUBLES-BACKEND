import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/responseHelper.js";
import UserService from "./user.service.js";

export default class UserController {
    static getProfile = asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const data = await UserService.getProfile(userId);
        return sendSuccess(res, data, "User profile fetched successfully", httpStatus.OK);
    });

    static updateProfile = asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const data = await UserService.updateProfile(userId, req.body);
        return sendSuccess(res, data, "User profile updated successfully", httpStatus.OK);
    });
}
