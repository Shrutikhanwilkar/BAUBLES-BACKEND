import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/responseHelper.js";
import GiftService from "./gift.service.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
export default class GiftController {
  static listGifts = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const data = await GiftService.listGifts({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || "",
    });
    return sendSuccess(res, data, "Gifts fetched successfully", HTTPStatusCode.OK);
  });
  static getGift = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await GiftService.getGift(id);
    return sendSuccess(res, data, "Gift fetched successfully", HTTPStatusCode.OK);
  });

  static getRandomGift = asyncHandler(async (req, res) => {
    const data = await GiftService.getRandomGift(req.user);
    return sendSuccess(res, data, "Gift fetched successfully", HTTPStatusCode.OK);
  });
}
