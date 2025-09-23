import httpStatus from "http-status";
import User from "../../models/auth.model.js"
import AppError from "../../utils/appError.js";
import { removeFromFirebase } from "../../middleware/upload.js";

export default class UserService {
    static async getProfile(userId) {
        const user = await User.findById(userId).select("-password -otp -otpExpiredAt");
        if (!user) {
            throw new AppError({
                status: false,
                message: "User not found",
                httpStatus: httpStatus.NOT_FOUND,
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
                httpStatus: httpStatus.NOT_FOUND,
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
                httpStatus: httpStatus.BAD_REQUEST,
            });
        }
        const existingAvatar = user?.avatar
        if (!user) {
            throw new AppError({
                message: "User not found or not authorized",
                httpStatus: httpStatus.NOT_FOUND,
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
                httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
                details: err.message,
            });
        }

    }
}
