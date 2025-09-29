import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import httpStatus from "http-status";
import MessageService from "./Message.service.js";

class MessageController {

    static sendMessage = asyncHandler(async (req, res) => {
        const { childId, statusCategoryId } = req.body;
        const data = await MessageService.sendMessage(childId, statusCategoryId);
        return sendSuccess(res, data, "Message sent successfully", httpStatus.CREATED);
    });

    static listMessages = asyncHandler(async (req, res) => {
        const { childId } = req.params;
        const data = await MessageService.listMessages(childId);
        return sendSuccess(res, data, "Messages fetched successfully", httpStatus.OK);
    });

    static listChildrenWithLastMessage = asyncHandler(async (req, res) => {
        const parentId = req.user.id;
        const data = await MessageService.listChildrenWithLastMessage(parentId);
        return sendSuccess(res, data, "Children with last message fetched successfully", httpStatus.OK);
    });

}

export default MessageController;
