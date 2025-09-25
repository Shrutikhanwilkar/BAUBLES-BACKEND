import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import StatusCategoryService from "./statusCategory.service.js";

export default class StatusCategoryController {
    static addCategory = asyncHandler(async (req, res) => {
        const data = await StatusCategoryService.addCategory(req.body);
        return sendSuccess(res, data, "Category created successfully", httpStatus.CREATED);
    });

    static updateCategory = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const data = await StatusCategoryService.updateCategory(categoryId, req.body);
        return sendSuccess(res, data, "Category updated successfully", httpStatus.OK);
    });

    static listCategories = asyncHandler(async (req, res) => {
        const data = await StatusCategoryService.listCategories();
        return sendSuccess(res, data, "Categories fetched successfully", httpStatus.OK);
    });

    static getCategory = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const data = await StatusCategoryService.getCategory(categoryId);
        return sendSuccess(res, data, "Category fetched successfully", httpStatus.OK);
    });

    static deleteCategory = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const data = await StatusCategoryService.deleteCategory(categoryId);
        return sendSuccess(res, data, "Category deleted successfully", httpStatus.OK);
    });
}
