import httpStatus from "http-status";
import User from "../../models/auth.model.js"
import AppError from "../../utils/appError.js";
import { removeFromFirebase } from "../../middleware/upload.js";
import StatusCategory from "../../models/statusCategory.model.js";
import StaticPage from "../../models/staticPage.model.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import dashboardModel from "../../models/dashboard.model.js";

export default class UserService {
    static async getProfile(userId) {
        const user = await User.findById(userId).select("-password -otp -otpExpiredAt");
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
        const existingAvatar = user?.avatar
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
            console.log(err)
            throw new AppError({
              message: "Failed to update avatar",
              httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
              details: err.message,
            });
        }

    }
    static async staticData (){
        const statusCategories = await StatusCategory.find().sort({ visibilityRank: 1, createdAt: 1 }).select("name color description").lean();; 
        const staticPages = await StaticPage.find().sort({ createdAt: -1 }).lean();
        const dashbaordVedio=await dashboardModel.find({status:'active'});
        return {
          statusCategories,
          staticPages,
          dashbaordVedio,
        };
    }
}
