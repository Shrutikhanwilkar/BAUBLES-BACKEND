    import httpStatus from "http-status";
import User from "../../models/auth.model.js"
import AppError from "../../utils/appError.js";

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
}
