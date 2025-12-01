import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import GiftService from "./gift.service.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class GiftController {
  static create = asyncHandler(async (req, res) => {
    const data = await GiftService.create(req.body);
    return sendSuccess(
      res,
      data,
      "Gift created successfully",
      HTTPStatusCode.CREATED
    );
  });

  static listGifts = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const data = await GiftService.listGifts({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || "",
    });
    return sendSuccess(
      res,
      data,
      "Gifts fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static getGift = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await GiftService.getGift(id);
    return sendSuccess(
      res,
      data,
      "Gift fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static updateGift = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await GiftService.updateGift(id, req.body);
    return sendSuccess(
      res,
      data,
      "Gift updated successfully",
      HTTPStatusCode.OK
    );
  });

  static deleteGift = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await GiftService.deleteGift(id);
    return sendSuccess(
      res,
      data,
      "Gift deleted successfully",
      HTTPStatusCode.OK
    );
  });

  static createPackage = asyncHandler(async (req, res) => {
    const data = await GiftService.createPackage(req.body);
    return sendSuccess(res, data, "Package created", HTTPStatusCode.CREATED);
  });

  static listPackages = asyncHandler(async (req, res) => {
    const data = await GiftService.getAllPackages(req.query);
    return sendSuccess(res, data, "Packages fetched", HTTPStatusCode.OK);
  });

  static packageDetail = asyncHandler(async (req, res) => {
    const data = await GiftService.getPackageById(req.params.id);
    return sendSuccess(res, data, "Package detail fetched", HTTPStatusCode.OK);
  });

  static updatePackage = asyncHandler(async (req, res) => {
    const data = await GiftService.updatePackage(
      req.params.id,
      req.body
    );
    return sendSuccess(res, data, "Package updated", HTTPStatusCode.OK);
  });

  static deletePackage = asyncHandler(async (req, res) => {
    await GiftService.deletePackage(req.params.id);
    return sendSuccess(res, null, "Package deleted", HTTPStatusCode.OK);
  });
}
