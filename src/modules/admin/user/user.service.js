import mongoose from "mongoose";
import User from "../../../models/auth.model.js"
import Children from "../../../models/children.model.js";
import AppError from "../../../utils/appError.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class UserService {
  static async listUsers({ page = 1, limit = 10, search }) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    const match = { role: "USER" };

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      match.$or = [{ name: regex }, { email: regex }, { mobile: regex }];
    }

    const pipeline = [
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "childrens",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$parentId", "$$userId"] },
              },
            },
            {
              $lookup: {
                from: "messages",
                let: { childId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$childId", "$$childId"] },
                    },
                  },
                  { $sort: { createdAt: -1 } },
                  { $limit: 1 },

                  {
                    $lookup: {
                      from: "statuscategories",
                      localField: "statusCategoryId",
                      foreignField: "_id",
                      as: "statusCategory",
                    },
                  },
                  {
                    $unwind: {
                      path: "$statusCategory",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      createdAt: 1,
                      statusCategory: {
                        _id: 1,
                        name: 1,
                        color: 1,
                      },
                    },
                  },
                ],
                as: "lastMessage",
              },
            },

            {
              $addFields: {
                lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
              },
            },
          ],
          as: "childrens",
        },
      },
      {
        $addFields: {
          childrenCount: { $size: "$childrens" },
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { uid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$childId", "$$uid"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },

            {
              $lookup: {
                from: "statuscategories",
                localField: "statusCategoryId",
                foreignField: "_id",
                as: "statusCategory",
              },
            },
            {
              $unwind: {
                path: "$statusCategory",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                createdAt: 1,
                statusCategory: {
                  _id: 1,
                  name: 1,
                  color: 1,
                },
              },
            },
          ],
          as: "lastMessage",
        },
      },

      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          mobile: { $ifNull: ["$mobile", ""] },
          isEmailVerified: 1,
          createdAt: 1,
          childrenCount: 1,
          childrens: 1, // includes child.lastMessage
          lastMessage: 1, // user’s own last message
        },
      },
    ];

    const [users, total] = await Promise.all([
      User.aggregate(pipeline),
      User.countDocuments(match),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserDetails(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError({
        message: "Invalid user ID",
        httpStatus: HTTPStatusCode.BAD_REQUEST,
      });
    }

    const user = await User.findOne({ _id: userId, role: "USER" }).select(
      "-password -otp -otpExpiredAt"
    );

    if (!user) {
      throw new AppError({
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    // ✅ Fetch children and their last message status
    const children = await Children.aggregate([
      { $match: { parentId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "messages",
          let: { childId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$childId", "$$childId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "statuscategories",
                localField: "statusCategoryId",
                foreignField: "_id",
                as: "statusCategory",
              },
            },
            {
              $unwind: {
                path: "$statusCategory",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                createdAt: 1,
                "statusCategory._id": 1,
                "statusCategory.name": 1,
                "statusCategory.color": 1,
              },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $project: {
          firstName: 1,
          avatar: 1,
          dob: 1,
          state: 1,
          gender: 1,
          createdAt: 1,
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        },
      },
    ]);

    return { user, children };
  }
}
