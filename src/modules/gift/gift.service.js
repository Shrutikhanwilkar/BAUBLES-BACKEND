import httpStatus from "http-status";
import Gift from "../../models/gift.model.js";
import AppError from "../../utils/appError.js";
import authModel from "../../models/auth.model.js";
import Children from "../../models/children.model.js";
import giftcategoryModel from "../../models/giftcategory.model.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import {
  isAgeMatch,
  isFirstAppOpenToday,
  isHolidayPeriod,
  isPackageActiveByDate,
  isWeekend,
} from "../../utils/giftHelper.js";

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
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    return gift;
  }

  static async getRandomGift(reqUser, limit = 20) {
    const today = new Date();
    const weekend = isWeekend(today);
    const holiday = isHolidayPeriod(today);

    const firstOpen = await isFirstAppOpenToday(reqUser._id);
    console.log(firstOpen);
    const packages = (
      await giftcategoryModel
        .find({ isActive: true })
        .sort({ priority: 1 })
        .lean()
    ).filter((pkg) => isPackageActiveByDate(pkg, today));

    const orderedPackageIds = [];

    /* Exclusive First App Open */
    if (!firstOpen) {
      const exclusivePkg = packages.find((p) => p.isExclusiveFirstAppOpen);
      if (exclusivePkg) orderedPackageIds.push(exclusivePkg._id);
    }

    /* Holiday Package (only AFTER first open) */
    if (!firstOpen && holiday) {
      packages
        .filter((p) => p.isHoliday)
        .forEach((p) => orderedPackageIds.push(p._id));
    }

    const targetedAgePackages = packages.filter((p) => p.isTargetedAgeOnly);

    const ageMatchResults = await Promise.all(
      targetedAgePackages.map((pkg) =>
        isAgeMatch(reqUser._id, pkg).then((match) => ({ match, pkg }))
      )
    );

    ageMatchResults
      .filter((r) => r.match)
      .forEach((r) => orderedPackageIds.push(r.pkg._id));

    /* Weekend Only */
    if (weekend) {
      packages
        .filter((p) => p.isWeekendOnly)
        .forEach((p) => orderedPackageIds.push(p._id));
    }

    /* Basic Package (ALWAYS LAST) */
    packages
      .filter((p) => p.isBasic)
      .forEach((p) => orderedPackageIds.push(p._id));

    if (!orderedPackageIds.length) {
      throw new AppError({
        status: false,
        message: "No gift available, stay tuned!",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    /* Fetch Gifts */
    const gifts = await Gift.find({
      isActive: true,
      category: { $in: orderedPackageIds },
    }).lean();
    console.log(gifts);
    if (!gifts.length) {
      throw new AppError({
        status: false,
        message: "No gift available, stay tuned!",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    /* Preserve order */
    const orderedGifts = orderedPackageIds.flatMap((pkgId) =>
      gifts.filter((g) => String(g.category) === String(pkgId))
    );

    return orderedGifts;
  }
}
