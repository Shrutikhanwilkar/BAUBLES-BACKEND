import httpStatus from "http-status";
import StatusCategory from "../../../models/statusCategory.model.js";
import AppError from "../../../utils/appError.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class StatusCategoryService {

    static async addCategory(reqBody) {
        const category = await StatusCategory.create(reqBody);
        return category;
    }

    static async updateCategory(id, reqBody) {
        const category = await StatusCategory.findById(id);
        if (!category) {
            throw new AppError({
              status: false,
              message: "Status Category not found",
              httpStatus: HTTPStatusCode.NOT_FOUND,
            });
        }

        Object.assign(category, reqBody);
        await category.save();

        return category;
    }

    static async listCategories() {
        return await StatusCategory.find().sort({ visibilityRank: 1, createdAt:1 });
    }

    static async getCategory(id) {
        const category = await StatusCategory.findById(id);
        if (!category) {
            throw new AppError({
              status: false,
              message: "Status Category not found",
              httpStatus: HTTPStatusCode.NOT_FOUND,
            });
        }
        return category;
    }

    static async deleteCategory(id) {
        const category = await StatusCategory.findById(id);
        if (!category) {
            throw new AppError({
              status: false,
              message: "Status Category not found",
              httpStatus: HTTPStatusCode.NOT_FOUND,
            });
        }

        await category.deleteOne();
        return null;
    }
}
