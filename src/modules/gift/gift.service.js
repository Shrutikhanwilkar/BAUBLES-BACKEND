import httpStatus from "http-status";
import Gift from "../../models/gift.model.js";
import AppError from "../../utils/appError.js";

export default class GiftService {
  static async listGifts({ page = 1, limit = 10, search = "" }) {
    const skip = (page - 1) * limit;

    const pipeline = [];
    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: "i" },
        },
      });
    }
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    });
    const result = await Gift.aggregate(pipeline);

    const data = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return {
      page,
      limit,
      total,
      data,
    };
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

  static async getRandomGift() {
    const giftData = await Gift.aggregate([{ $sample: { size: 1 } }]);
    return  giftData[0];
  }
}
