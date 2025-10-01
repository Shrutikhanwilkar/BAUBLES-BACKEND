import httpStatus from "http-status";
import Gift from "../../../models/gift.model.js"
import AppError from "../../../utils/appError.js";
import { removeFromFirebase } from "../../../middleware/upload.js";

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
        let gift = await Gift.findById(giftId);
        const newImage = reqBody.image;
        const oldImage = gift?.image;

        try {
            if (!gift) {
                if (newImage) {
                    console.log(1)
                    await removeFromFirebase(newImage);
                }
                throw new AppError({
                    status: false,
                    message: "Gift not found",
                    httpStatus: httpStatus.NOT_FOUND,
                });
            }
            const updatedGift = await Gift.findByIdAndUpdate(giftId, reqBody, {
                new: true,
                runValidators: true,
            });
            if (newImage && oldImage && newImage !== oldImage) {
                console.log(2)
                await removeFromFirebase(oldImage);
            }

            return updatedGift;
        } catch (error) {
            if (newImage && (!gift || newImage !== oldImage)) {
                console.log(3)
                await removeFromFirebase(newImage);
            }
            throw error;
        }
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
        await removeFromFirebase(gift.image);
        return null;
    }
}
