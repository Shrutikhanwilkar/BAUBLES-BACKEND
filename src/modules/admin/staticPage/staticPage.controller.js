import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import StaticPageService from "./staticPage.service.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class StaticPageController {
    static addPage = asyncHandler(async (req, res) => {
        const data = await StaticPageService.addPage(req.body);
        return sendSuccess(res, data, "Page created successfully", HTTPStatusCode.CREATED);
    });

    static updatePage = asyncHandler(async (req, res) => {
        const { pageId } = req.params;
        const data = await StaticPageService.updatePage(pageId,req.body);
        return sendSuccess(res, data, "Page updated successfully", HTTPStatusCode.OK);
    });

    static listPages = asyncHandler(async (req, res) => {
        const data = await StaticPageService.listPages();
        return sendSuccess(res, data, "Pages fetched successfully", HTTPStatusCode.OK);
    });

    static getPage = asyncHandler(async (req, res) => {
        const { pageId } = req.params;
        const data = await StaticPageService.getPage(pageId);
        return sendSuccess(res, data, "Page fetched successfully", HTTPStatusCode.OK);
    });

    static deletePage = asyncHandler(async (req, res) => {
        const { pageId } = req.params;
        const data = await StaticPageService.deletePage(pageId);
        return sendSuccess(res, data, "Page deleted successfully", HTTPStatusCode.OK);
    });
}
