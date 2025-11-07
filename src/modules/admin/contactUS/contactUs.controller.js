import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import ContactUsService from "./contactUs.service.js";

export default class ContactUsController {
    static create = asyncHandler(async (req, res) => {
        const data = await ContactUsService.create(req.body);
        return sendSuccess(res, data, "Contact created successfully", httpStatus.CREATED);
    });

    static listContacts = asyncHandler(async (req, res) => {
        
        const data = await ContactUsService.listContacts(req.query);
        return sendSuccess(res, data, "Contacts fetched successfully", httpStatus.OK);
    });

    static getContact = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await ContactUsService.getContact(id);
        return sendSuccess(res, data, "Contact fetched successfully", httpStatus.OK);
    });

    static deleteContact = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const data = await ContactUsService.deleteContact(id);
        return sendSuccess(res, data, "Contact deleted successfully", httpStatus.OK);
    });
}
