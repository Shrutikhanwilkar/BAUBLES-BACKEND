import User from "../../../models/auth.model.js";
import Children from "../../../models/children.model.js";
import Gift from "../../../models/gift.model.js";
import Music from "../../../models/music.model.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import { removeFromFirebase } from "../../../middleware/upload.js";
import AppError from "../../../utils/appError.js";
import audioPlaybackModel from "../../../models/audioPlayback.model.js";
import { Role } from "../../../utils/constants.js";
import { hashPassword } from "../../../utils/passwordHelper.js";
import appVersionModel from "../../../models/appVersion.model.js";
import {
  sendBulkPushNotification,
  sendPushNotification,
} from "../../../utils/fcmNotification.js";
import authModel from "../../../models/auth.model.js";
import broadcastModel from "../../../models/broadcast.model.js";
export default class CommonService {
  // static async getDashboardStats() {
  //   const [
  //     userCount,
  //     childrenCount,
  //     giftCount,
  //     musicCount,
  //     dashbaordVideo,
  //     maleChildrenCount,
  //     femaleChildrenCount,
  //   ] = await Promise.all([
  //     User.countDocuments({ role: "USER" }),
  //     Children.countDocuments(),
  //     Gift.countDocuments(),
  //     Music.countDocuments(),
  //     audioPlaybackModel.findOne({ isDashboard: true }).select("videoFile"),
  //     Children.countDocuments({ gender: "male" }),
  //     Children.countDocuments({ gender: "female" }),
  //   ]);

  //   return {
  //     userCount,
  //     childrenCount,
  //     giftCount,
  //     musicCount,
  //     dashbaordVideo,
  //     maleChildrenCount,
  //     femaleChildrenCount,
  //   };
  // }
  static async getDashboardStats() {
    const [
      userCount,
      childrenCount,
      maleChildren,
      femaleChildren,
      giftCount,
      musicCount,
      dashboardVideo,
      stateWiseCounts,
    ] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      Children.countDocuments(),
      Children.countDocuments({ gender: "male" }),
      Children.countDocuments({ gender: "female" }),
      Gift.countDocuments(),
      Music.countDocuments(),
      audioPlaybackModel.findOne({ isDashboard: true }).select("videoFile"),

      // Aggregate count per Australian state
      Children.aggregate([
        {
          $match: {
            state: {
              $in: [
                "New South Wales",
                "Victoria",
                "Queensland",
                "Western Australia",
                "South Australia",
                "Tasmania",
              ],
            },
          },
        },
        {
          $group: {
            _id: "$state",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Convert array → object:  { "Victoria": 12, "Queensland": 5 }
    const stateCounts = {};
    stateWiseCounts?.forEach((s) => {
      stateCounts[s._id] = s.count;
    });

    return {
      userCount,
      childrenCount,
      maleChildren,
      femaleChildren,
      giftCount,
      musicCount,
      dashboardVideo,
      stateCounts,
    };
  }

  static async getProfile(adminId) {
    const admin = await User.findOne({
      _id: adminId,
      role: { $ne: Role.USER },
    }).select("-password -otp -otpExpiredAt");
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
      { _id: adminId, role: { $ne: Role.USER } },
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
    const admin = await User.findOne({
      _id: adminId,
      role: { $ne: Role.USER },
    });
    if (!admin) {
      throw new AppError({
        status: false,
        message: "Admin not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    // const isMatch = await comparePassword(oldPassword, admin.password);
    // if (!isMatch) {
    //   throw new AppError({
    //     status: false,
    //     message: "Old password is incorrect",
    //     httpStatus: HTTPStatusCode.UNAUTHORIZED,
    //   });
    // }

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
      throw new AppError({
        message: "Failed to update avatar",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }
  static async addDashboardVedio(reqBody) {
    try {
      await audioPlaybackModel.findOneAndDelete({ isDashboard: true });
      let data = await audioPlaybackModel.create({
        videoFile: reqBody.videoFile,
        isDashboard: true,
      });
      data = await audioPlaybackModel
        .findOne({ isDashboard: true })
        .select("videoFile");
      return data;
    } catch (err) {
      throw new AppError({
        message: "Failed to add dashbaord vedio",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }
  static async appVerisonUpdate(reqBody) {
    const { iosVersion, androidVersion, forceUpdate } = reqBody;

    const updatedVersion = await appVersionModel.findOneAndUpdate(
      {},
      { iosVersion, androidVersion, forceUpdate },
      { new: true, upsert: true }
    );

    // 🔔 Send Notification to All Users
    await sendBulkPushNotification(
      "App Update Available!",
      `App updated. Tap to see what is new`,
      { iosVersion, androidVersion, type: "SETTING" }
    );
  }
  static async sendBroadcastToAll(reqBody) {
    const users = await authModel.find({
      deviceToken: { $exists: true, $ne: null },
      role: Role.USER,
    });

    if (!users.length) {
      return { success: false, message: "No users found with device tokens" };
    }
    let title = "";
    let body = "";
    const sendPromises = users.map((user) => {
      const parentName = user.name ? user.name : "Parent";

      title = reqBody?.title || "New broadcast message received";
      body =
        reqBody?.body ||
        `${parentName} - you have received a new message from the NoN Bauble team. Tap to view.`;

      const data = {
        type: "DASHBOARD",
      };

      return sendPushNotification(
        user._id,
        user.deviceToken,
        title,
        body,
        data
      );
    });

    await Promise.allSettled(sendPromises);

    await broadcastModel.create({
      activeUserCount: users.length,
      body: body,
      title: title,
      type: reqBody?.type,
    });
    return {
      success: true,
      message: "Broadcast message sent to all users",
      users: users.length,
    };
  }
  static async broadcastHistory() {
    try {
      // Fetch all broadcast messages sorted by latest first
      const history = await broadcastModel.find().sort({ createdAt: -1 });

      return {
        total: history.length,
        data: history,
      };
    } catch (error) {
      console.error("Error fetching broadcast history:", error);
      throw new CustomError("Unable to fetch broadcast history", 500);
    }
  }

  // Get latest version (Admin View)
  static async appVersion() {
    return await appVersionModel.findOne();
  }
}
