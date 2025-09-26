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
    static updateAvatar = asyncHandler(async (req, res) => {
        const id = req.user.id;
        const avatarUrl = req.body.avatar;
        const data = await UserService.updateAvatar(id, avatarUrl);
        return sendSuccess(res, data, "Avatar updated successfully", httpStatus.OK);
    })
    static staticData = asyncHandler(async (req, res) => {
        const data = await UserService.staticData();
        return sendSuccess(res, data, "Data fetched successfully", httpStatus.OK);
    })
}
