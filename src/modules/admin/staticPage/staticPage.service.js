import httpStatus from "http-status";
import StaticPage from "../../../models/staticPage.model.js";
import AppError from "../../../utils/appError.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class StaticPageService {

    static async addPage(reqBody) {
        const page = await StaticPage.create(reqBody);
        return page;
    }

    static async updatePage(id,reqBody) {
        const page = await StaticPage.findById(id);
        if (!page) {
            throw new AppError({
              status: false,
              message: "Page not found",
              httpStatus: HTTPStatusCode.NOT_FOUND,
            });
        }

        Object.assign(page, reqBody);
        await page.save();

        return page;
    }
    static async listPages() {
        return await StaticPage.find().sort({ createdAt: -1 });
    }
    static async getPage(pageId) {
        const page = await StaticPage.findById(pageId);
        if (!page) {
            throw new AppError({
              status: false,
              message: "Page not found",
              httpStatus: HTTPStatusCode.NOT_FOUND,
            });
        }
        return page;
    }
    static async deletePage(pageId) {
        const page = await StaticPage.findById(pageId);
        if (!page) {
            throw new AppError({
              status: false,
              message: "Page not found",
              httpStatus: HTTPStatusCode.NOT_FOUND,
            });
        }

        await page.deleteOne();
        return page;
    }
}
