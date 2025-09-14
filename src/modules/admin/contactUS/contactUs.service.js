import httpStatus from "http-status";
import ContactUs from "../../models/contactUs.model.js";
import AppError from "../../utils/appError.js";

export default class ContactUsService {
    static async create(reqBody) {
        const contact = await ContactUs.create(reqBody);
        return contact;
    }

    static async listContacts() {
        return await ContactUs.find().sort({ createdAt: -1 });
    }
    static async getContact(contactId) {
        const contact = await ContactUs.findById(contactId);
        if (!contact) {
            throw new AppError({
                status: false,
                message: "Contact not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }
        return contact;
    }

    static async deleteContact(contactId) {

        const contact = await ContactUs.findById(contactId);
        if (!contact) {
            throw new AppError({
                status: false,
                message: "Contact not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        await contact.deleteOne();
        return contact;
    }
}
