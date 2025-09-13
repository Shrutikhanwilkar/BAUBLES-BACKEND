import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/responseHelper.js";
import StaticPageService from "./staticPage.service.js";

export default class StaticPageController {
    static getPageBySlug = asyncHandler(async (req, res) => {
        const { slug } = req.params;
        const data = await StaticPageService.getPageBySlug(slug);
        return sendSuccess(res, data, "Page fetched successfully", httpStatus.OK);
    });
      
}
