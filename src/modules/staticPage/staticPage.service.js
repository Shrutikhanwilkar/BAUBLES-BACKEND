import httpStatus from "http-status";
import StaticPage from "../../models/staticPage.model.js";
import AppError from "../../utils/appError.js";

export default class StaticPageService {
    static async getPageBySlug(slug) {
        const page = await StaticPage.findOne({ slug });
        if (!page) {
            throw new AppError({
                status: false,
                message: "Page not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }
        return page;
      }
}
