import httpStatus from "http-status";
import Children from "../../models/children.model.js";
import AppError from "../../utils/appError.js";
import { removeFromFirebase } from "../../middleware/upload.js";
import mongoose from "mongoose";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import authModel from "../../models/auth.model.js";
import { sendPushNotification } from "../../utils/fcmNotification.js";
export default class ChildrenService {
  static async addChild(reqBody) {
    const { firstName, dob, state, gender, avatar } = reqBody;
    const parentId = reqBody.user.id;

    const childCount = await Children.countDocuments({ parentId });
    if (childCount >= 5) {
      throw new AppError({
        status: false,
        message: "You cannot add more than 5 children",
        httpStatus: HTTPStatusCode.BAD_REQUEST,
      });
    }

    try {
      // Create child with optional avatar
      const child = await Children.create({
        firstName,
        dob,
        state,
        gender,
        parentId,
        avatar: avatar || null,
      });
      //notification
      let parentData = await authModel
        .findOne({ _id: parentId })
        .select("_id deviceToken");
      if (parentData?.deviceToken) {
        const title = "Setup Complete";
        const body =
          "You are all set. Your bauble magic is ready. Tap to go to your dashboard";

        await sendPushNotification(
          parentId,
          parentData?.deviceToken,
          title,
          body,
          {
            type: "SETUP_COMPLETE",
            destination: "CHILDREN_DASHBOARD",
          }
        );
      }
      return {
        _id: child._id,
        firstName: child.firstName,
        dob: child.dob,
        state: child.state,
        gender: child.gender,
        avatar: child.avatar || null,
      };
    } catch (err) {
      // Rollback avatar file if provided and save fails
      if (avatar) {
        await removeFromFirebase(avatar);
      }
      throw new AppError({
        message: "Failed to add child",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }

  static async updateChild(reqBody) {
    const { childId, firstName, dob, state, gender, avatar } = reqBody;
    const parentId = reqBody.user.id;
    const child = await Children.findOne({ _id: childId, parentId });
    if (!child) {
      throw new AppError({
        status: false,
        message: "Child not found or not authorized",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    if (firstName) child.firstName = firstName;
    if (dob) child.dob = dob;
    if (state) child.state = state;
    if (gender) child.gender = gender;
    if (avatar) {
      child.avatar = avatar;
    }

    await child.save();

    return {
      _id: child._id,
      firstName: child.firstName,
      dob: child.dob,
      state: child.state,
      gender: child.gender,
      avatar: child.avatar || null,
    };
  }
  // List all children of a parent
  static async listChildren(reqBody) {
    const parentId = reqBody.user.id;
    const children = await Children.find({ parentId }).sort({ createdAt: -1 });

    return children.map((child) => ({
      _id: child._id,
      firstName: child.firstName,
      avatar: child.avatar || null,
      dob: child.dob,
      state: child.state,
      gender: child.gender,
    }));
  }
  static async deleteChild(reqBody) {
    const { childId } = reqBody;
    const parentId = reqBody.user.id;
    const child = await Children.findOne({ _id: childId, parentId });
    if (!child) {
      throw new AppError({
        status: false,
        message: "Child not found or not authorized",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    await child.deleteOne();

    return {
      _id: childId,
    };
  }
  static async updateAvatar(childId, parentId, avatarUrl) {
    const child = await Children.findOne({ _id: childId, parentId });
    const existingAvatar = child.avatar;
    if (!child) {
      throw new AppError({
        message: "Child not found or not authorized",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    try {
      child.avatar = avatarUrl;
      await child.save();
      await removeFromFirebase(existingAvatar);
      return {
        _id: child._id,
        firstName: child.firstName,
        avatar: child.avatar,
      };
    } catch (err) {
      await removeFromFirebase(avatarUrl);

      throw new AppError({
        message: "Failed to update avatar",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }
  static async listChildrenWithLastMessage(userId) {
    const pipeline = [
      { $match: { parentId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "childId",
          as: "messages",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: [{ $slice: ["$messages", -1] }, 0] },
        },
      },

      {
        $lookup: {
          from: "statuscategories",
          localField: "lastMessage.statusCategoryId",
          foreignField: "_id",
          as: "statusCategory",
        },
      },
      {
        $unwind: { path: "$statusCategory", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "musics",
          localField: "lastMessage.musicId",
          foreignField: "_id",
          as: "music",
        },
      },
      { $unwind: { path: "$music", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          firstName: 1,
          avatar: 1,
          lastMessage: {
            _id: 1,
            "statusCategory._id": "$statusCategory._id",
            "statusCategory.name": "$statusCategory.name",
            "statusCategory.color": "$statusCategory.color",
            "music._id": "$music._id",
            "music.title": "$music.title",
            "music.musicFile": "$music.musicFile",
          },
        },
      },
    ];
    const data = await Children.aggregate(pipeline);
    return data;
  }
}
