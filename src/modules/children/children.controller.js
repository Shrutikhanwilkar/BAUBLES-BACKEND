import ChildrenService from "./children.service.js";
import { sendSuccess, sendError } from "../../utils/responseHelper.js";
import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
export default class ChildrenController {
    static addChild = asyncHandler(async (req, res) => {
        const data = await ChildrenService.addChild(req.body);
        sendSuccess(res, data, "Child added successfully", HTTPStatusCode.CREATED);
    });

    static updateChild = asyncHandler(async (req, res) => {
        const childId = req.params.id
        const data = await ChildrenService.updateChild({ ...req.body, childId });
        sendSuccess(res, data, "Child updated successfully", HTTPStatusCode.OK);
    });

    static listChildren = asyncHandler(async (req, res) => {
        const data = await ChildrenService.listChildren(req.body);
        sendSuccess(res, data, "Children list fetched successfully", HTTPStatusCode.OK);
    });
    static deleteChild = asyncHandler(async (req, res) => {
        const childId = req.params.id
        const data = await ChildrenService.deleteChild({ ...req.body, childId });
        sendSuccess(res, data, "Child deleted successfully", HTTPStatusCode.OK);
    });
    static updateAvatar = asyncHandler(async (req, res) => {
        const { childId } = req.params;
        const parentId = req.user.id;
        const avatarUrl = req.body.avatar;
        const data = await ChildrenService.updateAvatar(childId, parentId, avatarUrl);
        return sendSuccess(res, data, "Avatar updated successfully", HTTPStatusCode.OK);
    })
    static listChildrenWithLastMessage = asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const data = await ChildrenService.listChildrenWithLastMessage(userId);
        return sendSuccess(res, data, "Children with last message fetched", HTTPStatusCode.OK);
    });
}
