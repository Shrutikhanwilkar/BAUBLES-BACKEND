import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import httpStatus from "http-status";
import ChildrenService from "./children.service.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class ChildrenController {
    static listChildren = asyncHandler(async (req, res) => {
        const data = await ChildrenService.listChildren(req.query);
        return sendSuccess(res, data, "Children fetched successfully", HTTPStatusCode.OK);
    });

    static getChildById = asyncHandler(async (req, res) => {
        const data = await ChildrenService.getChildById(req.params.id);
        return sendSuccess(res, data, "Child details fetched successfully", HTTPStatusCode.OK);
    });
}
