import mongoose from "mongoose";
import Children from "../../../models/children.model.js";
import AppError from "../../../utils/appError.js";
import httpStatus from "http-status";

export default class AdminChildrenService {
    static async listChildren({ page = 1, limit = 10, search, state, gender }) {
        const skip = (page - 1) * limit;
        const match = {};

        if (search) {
            match.firstName = { $regex: search, $options: "i" };
        }
        if (state) {
            match.state = { $regex: state, $options: "i" };
        }
        if (gender) {
            match.gender = gender;
        }

        const result = await Children.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "users",
                    localField: "parentId",
                    foreignField: "_id",
                    as: "parent",
                },
            },
            { $unwind: "$parent" },
            {
                $project: {
                    firstName: 1,
                    dob: 1,
                    state: 1,
                    gender: 1,
                    avatar: 1,
                    createdAt: 1,
                    "parent._id": 1,
                    "parent.name": 1,
                    "parent.email": 1,
                    "parent.mobile": 1,
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: Number(limit) }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);

        const children = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        return {
            children,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // ✅ Get child details by ID (with parent info)
    static async getChildById(childId) {
        if (!mongoose.Types.ObjectId.isValid(childId)) {
            throw new AppError({
                message: "Invalid child ID",
                httpStatus: httpStatus.BAD_REQUEST,
            });
        }

        const result = await Children.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(childId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "parentId",
                    foreignField: "_id",
                    as: "parent",
                },
            },
            { $unwind: "$parent" },
            {
                $project: {
                    firstName: 1,
                    dob: 1,
                    state: 1,
                    gender: 1,
                    avatar: 1,
                    createdAt: 1,
                    "parent._id": 1,
                    "parent.name": 1,
                    "parent.email": 1,
                    "parent.mobile": 1,
                },
            },
        ]);

        if (!result.length) {
            throw new AppError({
                message: "Child not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        return result[0];
    }
}
