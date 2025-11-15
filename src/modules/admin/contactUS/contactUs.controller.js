import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import ContactUsService from "./contactUs.service.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
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

  static listContacts = asyncHandler(async (req, res) => {
    const data = await ContactUsService.listContacts(req.query);
    return sendSuccess(
      res,
      data,
      "Contacts fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static getContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await ContactUsService.getContact(id);
    return sendSuccess(
      res,
      data,
      "Contact fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await ContactUsService.deleteContact(id);
    return sendSuccess(
      res,
      data,
      "Contact deleted successfully",
      HTTPStatusCode.OK
    );
  });

  static updateContactQuery = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await ContactUsService.updateContactQuery(id, req.body);
    return sendSuccess(res, data, "Updated successfully", HTTPStatusCode.OK);
  });
}
