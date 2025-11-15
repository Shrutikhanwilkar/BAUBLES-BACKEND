import User from "../../../models/auth.model.js";
import Children from "../../../models/children.model.js";
import dashboardModel from "../../../models/dashboard.model.js";
import Gift from "../../../models/gift.model.js";
import Music from "../../../models/music.model.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import { removeFromFirebase } from "../../../middleware/upload.js";
import AppError from "../../../utils/appError.js";
export default class CommonService {
  static async getDashboardStats() {
    const [userCount, childrenCount, giftCount, musicCount] = await Promise.all(
      [
        User.countDocuments({ role: "USER" }),
        Children.countDocuments(),
        Gift.countDocuments(),
        Music.countDocuments(),
      ]
    );

    return {
      userCount,
      childrenCount,
      giftCount,
      musicCount,
    };
  }

  static async getProfile(adminId) {
    const admin = await User.findOne({ _id: adminId, role: "ADMIN" }).select(
      "-password -otp -otpExpiredAt"
    );
    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin profile not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    return admin;
  }
  static async updateProfile(adminId, reqBody) {
    const admin = await User.findOneAndUpdate(
      { _id: adminId, role: "ADMIN" },
      reqBody,
      { new: true, runValidators: true, select: "-password -otp -otpExpiredAt" }
    );

    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin not found or unauthorized",
        httpStatus: httpStatus.NOT_FOUND,
      });
    }

    return admin;
  }
  static async changePassword(adminId, { oldPassword, newPassword }) {
    const admin = await User.findOne({ _id: adminId, role: "ADMIN" });
    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    const isMatch = await comparePassword(oldPassword, admin.password);
    if (!isMatch) {
      throw new AppError({
        status: false,
        message: "Old password is incorrect",
        httpStatus: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();

    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      message: "Password updated successfully",
    };
  }
  static async uploadAvatar(id, avatarUrl) {
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

  static async uploadDashboardVedio(avatarUrl, payload) {
    if (!avatarUrl) {
      throw new AppError({
        message: "Please select a file to upload!",
        httpStatus: HTTPStatusCode.BAD_REQUEST,
      });
    }

    try {
      const newVideo = await dashboardModel.create({
        title: payload?.title,
        description: payload?.description,
        duration: payload?.duration,
        videoFile: avatarUrl,
        status: payload?.status || "active",
      });

      return newVideo;
    } catch (err) {
      await removeFromFirebase(avatarUrl); // cleanup
      console.log(err);

      throw new AppError({
        message: "Failed to upload video",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }

  static async getAllDashboardVideos() {
    return dashboardModel.find().sort({ createdAt: -1 });
  }

  static async updateDashboardVideo(id, payload) {
    const updated = await dashboardModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) {
      throw new AppError({
        message: "Video not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    return updated;
  }

  static async deleteDashboardVideo(id) {
    const video = await dashboardModel.findById(id);

    if (!video) {
      throw new AppError({
        message: "Video not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    await dashboardModel.deleteOne({ _id: id });

    // remove video file from firebase storage
    await removeFromFirebase(video.videoFile);

    return ;
  }
}
