import ChildrenService from "./children.service.js";
import { sendSuccess, sendError } from "../../utils/responseHelper.js";
import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";

export default class ChildrenController {
    static addChild = asyncHandler(async (req, res) => {
        const data = await ChildrenService.addChild(req.body);
        sendSuccess(res, data, "Child added successfully", httpStatus.CREATED);
    });

    static updateChild = asyncHandler(async (req, res) => {
        const childId = req.params.id
        const data = await ChildrenService.updateChild({ ...req.body, childId });
        sendSuccess(res, data, "Child updated successfully", httpStatus.OK);
    });

    static listChildren = asyncHandler(async (req, res) => {
        const data = await ChildrenService.listChildren(req.body);
        sendSuccess(res, data, "Children list fetched successfully", httpStatus.OK);
    });
    static deleteChild = asyncHandler(async (req, res) => {
        const childId = req.params.id
        const data = await ChildrenService.deleteChild({ ...req.body, childId });
        sendSuccess(res, data, "Child deleted successfully", httpStatus.OK);
    });
    static updateAvatar = asyncHandler(async (req, res) => {
        const { childId } = req.params;
        const parentId = req.user.id;
        const avatarUrl = req.body.avatar;
        const data = await ChildrenService.updateAvatar(childId, parentId, avatarUrl);
        return sendSuccess(res, data, "Avatar updated successfully", httpStatus.OK);
    })
}
