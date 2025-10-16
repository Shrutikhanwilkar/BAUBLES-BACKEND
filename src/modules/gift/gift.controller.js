import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/responseHelper.js";
import GiftService from "./gift.service.js";

export default class GiftController {
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

  static getRandomGift = asyncHandler(async (req, res) => {
    const data = await GiftService.getRandomGift();
    return sendSuccess(res, data, "Gift fetched successfully", httpStatus.OK);
  });
}
