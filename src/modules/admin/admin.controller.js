import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/responseHelper.js";
import AdminService from "./admin.service.js";

export default class AdminController {
    static getDashboardStats = asyncHandler(async (req, res) => {
        const data = await AdminService.getDashboardStats();
        return sendSuccess(res, data, "Dashboard stats fetched successfully", httpStatus.OK);
    });
}
