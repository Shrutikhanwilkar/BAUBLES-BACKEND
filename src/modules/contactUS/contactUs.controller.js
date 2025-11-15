import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/responseHelper.js";
import ContactUsService from "./contactUs.service.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
export default class ContactUsController {
    static create = asyncHandler(async (req, res) => {
        const data = await ContactUsService.create(req.body);
        return sendSuccess(
          res,
          data,
          "Contact created successfully",
          HTTPStatusCode.CREATED
        );
    });
}
