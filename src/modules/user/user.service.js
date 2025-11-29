import httpStatus from "http-status";
import User from "../../models/auth.model.js";
import AppError from "../../utils/appError.js";
import { removeFromFirebase } from "../../middleware/upload.js";
import StatusCategory from "../../models/statusCategory.model.js";
import StaticPage from "../../models/staticPage.model.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import audioPlaybackModel from "../../models/audioPlayback.model.js";
import notificationModel from "../../models/notification.model.js";

export default class UserService {
  static async getProfile(userId) {
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiredAt"
    );
    if (!user) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    return user;
  }

  static async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    Object.assign(user, updateData);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otp;
    delete userObj.otpExpiredAt;

    return userObj;
  }

  static async updateAvatar(id, avatarUrl) {
    const user = await User.findOne({ _id: id });
    if (!avatarUrl) {
      throw new AppError({
        message: "Please select a file to upload!",
        httpStatus: HTTPStatusCode.BAD_REQUEST,
      });
    }
    const existingAvatar = user?.avatar;
    if (!user) {
      throw new AppError({
        message: "User not found or not authorized",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    try {
      user.avatar = avatarUrl;
      await user.save();
      if (existingAvatar) {
        await removeFromFirebase(existingAvatar);
      }

      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      };
    } catch (err) {
      await removeFromFirebase(avatarUrl);
      console.log(err);
      throw new AppError({
        message: "Failed to update avatar",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }
  static async staticData() {
    const statusCategories = await StatusCategory.find()
      .sort({ visibilityRank: 1, createdAt: 1 })
      .select("name color description")
      .lean();
    const staticPages = await StaticPage.find().sort({ createdAt: -1 }).lean();
    // const dashbaordVedio = await audioPlaybackModel
    //   .findOne({ isDashboard: true })
    //   .select("videoFile isDashboard _id");
    // const audioPlayBackVideo = await audioPlaybackModel.find({ default: true });

    return {
      statusCategories,
      staticPages,
      // dashbaordVedio,
      // audioPlayBackVideo,
    };
  }
  static async getAudioPlayback() {
    const audioPlayBackVideo = await audioPlaybackModel.findOne({
      default: true,
    });
    if (!audioPlayBackVideo) {
      throw new AppError({
        message: "No audio playback available",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    return audioPlayBackVideo;
  }
  static async getDahsboardVedio() {
    const dashbaordVedio = await audioPlaybackModel
      .findOne({ isDashboard: true })
      .select("videoFile isDashboard _id");
    if (!dashbaordVedio) {
      throw new AppError({
        message: "No data available",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    return dashbaordVedio;
  }
  static async notificationList(page = 1, limit = 10,userId) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      notificationModel
        .find({ user: userId })
        .select("_id body title data createdAt data")
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit),

      notificationModel.countDocuments({ user: userId }),
    ]);

    if (!data || data.length === 0) {
      throw new AppError({
        message: "No data available",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
}
