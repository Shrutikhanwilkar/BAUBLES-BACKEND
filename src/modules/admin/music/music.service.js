import httpStatus from "http-status";
import Music from "../../../models/music.model.js";
import AppError from "../../../utils/appError.js";
import mongoose from "mongoose";

export default class MusicService {
    static async addMusic(reqBody) {

        const music = await Music.create(reqBody);
        return music;
    }

    static async updateMusic(id, reqBody) {
        const music = await Music.findById(id);
        if (!music) {
            throw new AppError({
                status: false,
                message: "Music not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        Object.assign(music, reqBody);
        await music.save();

        return music;
    }

    static async listMusic({ page = 1, limit = 10, statusCategoryId, search }) {
        const skip = (page - 1) * limit;
        const match = {};
        if (statusCategoryId) {
            match.statusCategory = new mongoose.Types.ObjectId(statusCategoryId);
        }
        if (search) {
            match.title = { $regex: search, $options: "i" };
        }

        const result = await Music.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "statuscategories",
                    localField: "statusCategory",
                    foreignField: "_id",
                    as: "statusCategory",
                },
            },
            { $unwind: "$statusCategory" },
            {
                $project: {
                    title: 1,
                    description: 1,
                    duration: 1,
                    musicFile: 1,
                    createdAt: 1,
                    "statusCategory._id":1,
                    "statusCategory.name": 1,
                    "statusCategory.color": 1,
                    "statusCategory.description": 1,
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(limit) }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const music = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        return {
            music,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getMusic(musicId) {
        if (!mongoose.Types.ObjectId.isValid(musicId)) {
            throw new AppError({
                status: false,
                message: "Invalid music ID",
                httpStatus: httpStatus.BAD_REQUEST,
            });
        }

        const pipeline = [
            { $match: { _id: new mongoose.Types.ObjectId(musicId) } },
            {
                $lookup: {
                    from: "statuscategories",
                    localField: "statusCategory",
                    foreignField: "_id",
                    as: "statusCategory",
                },
            },
            { $unwind: "$statusCategory" },
            {
                $project: {
                    title: 1,
                    description: 1,
                    duration: 1,
                    musicFile: 1,
                    "statusCategory.name": 1,
                    "statusCategory.color": 1,
                    "statusCategory.description": 1,
                },
            },
        ];

        const result = await Music.aggregate(pipeline);

        if (!result || result.length === 0) {
            throw new AppError({
                status: false,
                message: "Music not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        return result[0]; 
    }
   static async deleteMusic(musicId) {
        const music = await Music.findById(musicId);
        if (!music) {
            throw new AppError({
                status: false,
                message: "Music not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        await music.deleteOne();
        return null;
    }
}
