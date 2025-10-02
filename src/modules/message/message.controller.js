import asyncHandler from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/responseHelper.js"
import httpStatus from "http-status";
import MessageService from "./message.service.js"

class MessageController {

    static sendMessage = asyncHandler(async (req, res) => {
        const { childId, statusCategoryId } = req.body;
        const userId = req.user?.id
        console.log(userId)
        const data = await MessageService.sendMessage(userId, childId, statusCategoryId);
        return sendSuccess(res, data, "Message sent successfully", httpStatus.CREATED);
    });

    static listMessages = asyncHandler(async (req, res) => {
        const userId = req.user.id
        const data = await MessageService.listMessages(userId, req.query);
        return sendSuccess(res, data, "Data fetched successfully", httpStatus.OK);
    });
    static musicLibrary = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        const data = await MessageService.listMusicLibrary({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        });
        return sendSuccess(res, data, "Data fetched successfully", httpStatus.OK);
    });
}

export default MessageController;
