import httpStatus from "http-status";
import ContactUs from "../../models/contactUs.model.js";
import AppError from "../../utils/appError.js";

export default class ContactUsService {
    static async create(reqBody) {
        const contact = await ContactUs.create(reqBody);
        return contact;
    }

}
