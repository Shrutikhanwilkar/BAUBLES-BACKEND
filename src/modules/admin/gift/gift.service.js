import httpStatus from "http-status";
import Gift from "../../../models/gift.model.js"
import AppError from "../../../utils/appError.js";

export default class GiftService {
    static async create(reqBody) {
        const gift = await Gift.create(reqBody);
        return gift;
    }

    static async listGifts({ page = 1, limit = 10, search = "" }) {
        const skip = (page - 1) * limit;
        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const [data, total] = await Promise.all([
            Gift.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Gift.countDocuments(query),
        ]);

        return { page, limit, total, data };
    }

    static async getGift(giftId) {
        const gift = await Gift.findById(giftId);
        if (!gift) {
            throw new AppError({
                status: false,
                message: "Gift not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }
        return gift;
    }

    static async updateGift(giftId, reqBody) {
        const gift = await Gift.findByIdAndUpdate(giftId, reqBody, {
            new: true,
            runValidators: true,
        });
        if (!gift) {
            throw new AppError({
                status: false,
                message: "Gift not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }
        return gift;
    }

    static async deleteGift(giftId) {
        const gift = await Gift.findById(giftId);
        if (!gift) {
            throw new AppError({
                status: false,
                message: "Gift not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }
        await gift.deleteOne();
        return gift;
    }
}
