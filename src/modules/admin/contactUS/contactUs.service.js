import httpStatus from "http-status";
import ContactUs from "../../../models/contactUs.model.js";
import AppError from "../../../utils/appError.js";

export default class ContactUsService {
    static async create(reqBody) {
        const contact = await ContactUs.create(reqBody);
        return contact;
    }

    static async listContacts({ page = 1, limit = 10, type }) {
        const skip = (page - 1) * limit;

        const match = {};
        if (type) {
            match.type = type;
        }
        const [contacts, total] = await Promise.all([
            ContactUs.find(match)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            ContactUs.countDocuments(match),
        ]);

        return {
            contacts,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
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
