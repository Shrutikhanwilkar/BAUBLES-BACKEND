import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import GiftService from "./gift.service.js";

export default class GiftController {
    static create = asyncHandler(async (req, res) => {
        const data = await GiftService.create(req.body);
        return sendSuccess(res, data, "Gift created successfully", httpStatus.CREATED);
    });

    static listGifts = asyncHandler(async (req, res) => {
        const { page, limit, search } = req.query;
        const data = await GiftService.listGifts({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search: search || "",
        });
        return sendSuccess(res, data, "Gifts fetched successfully", httpStatus.OK);
    });

    static getGift = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await GiftService.getGift(id);
        return sendSuccess(res, data, "Gift fetched successfully", httpStatus.OK);
    });

    static updateGift = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await GiftService.updateGift(id, req.body);
        return sendSuccess(res, data, "Gift updated successfully", httpStatus.OK);
    });

    static deleteGift = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await GiftService.deleteGift(id);
        return sendSuccess(res, data, "Gift deleted successfully", httpStatus.OK);
    });
}
