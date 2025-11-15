import ContactUs from "../../../models/contactUs.model.js";
import AppError from "../../../utils/appError.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import { sendContactSolution } from "../../../utils/mailer.js";
export default class ContactUsService {
  static async create(reqBody) {
    const contact = await ContactUs.create(reqBody);
    return contact;
  }

  static async listContacts(reqQuery) {
    let limit = reqQuery.limit || 10;
    let page = reqQuery.page || 1;
    const skip = (page - 1) * limit;
    const match = {};
    if (reqQuery.type) {
      match.type = reqQuery.type;
    }
    if (reqQuery.isResolved == "true") {
      match.isResolved = true;
    } else if (reqQuery.isResolved == "false") {
      match.isResolved = false;
    }
    const [contacts, total, resolvedCount, unresolvedCount] = await Promise.all(
      [
        ContactUs.find(match)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),

        ContactUs.countDocuments(match),

        // Count only resolved
        ContactUs.countDocuments({ ...match, isResolved: true }),

        // Count only unresolved
        ContactUs.countDocuments({ ...match, isResolved: false }),
      ]
    );

    return {
      contacts,
      resolvedCount,
      unresolvedCount,
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
        httpStatus: HTTPStatusCode.NOT_FOUND,
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
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    await contact.deleteOne();
    return contact;
  }

  static async updateContactQuery(contactId, reqBody) {
    const contact = await ContactUs.findById(contactId);

    if (!contact) {
      throw new AppError({
        status: false,
        message: "Contact not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    if (reqBody.isResolved !== undefined && !reqBody.solution) {
      contact.isResolved = reqBody.isResolved;
      await contact.save();
      return contact;
    }
    if (reqBody.solution) {
      contact.isResolved = true; // Mark resolved
      contact.solution = reqBody.solution; // Save solution
      await contact.save();

      // ---- Send Email using AWS SES ----
    //   sendContactSolution(contact, reqBody.solution);

      return contact;
    }

    // If this point is reached, nothing changes
    return contact;
  }
}
