import httpStatus from "http-status";
import Gift from "../../../models/gift.model.js";
import AppError from "../../../utils/appError.js";
import { removeFromFirebase } from "../../../middleware/upload.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import giftcategoryModel from "../../../models/giftcategory.model.js";
export default class GiftService {
  static async create(reqBody) {
    const gift = await Gift.create(reqBody);
    return gift;
  }

  static async listGifts({ page = 1, limit = 10, search = "" }) {
    const skip = (page - 1) * limit;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const [data, total] = await Promise.all([
      Gift.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .lean(),
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
        httpStatus: HTTPStatusCode.NOT_FOUND,
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
          await removeFromFirebase(newImage);
        }
        throw new AppError({
          status: false,
          message: "Gift not found",
          httpStatus: HTTPStatusCode.NOT_FOUND,
        });
      }
      const updatedGift = await Gift.findByIdAndUpdate(giftId, reqBody, {
        new: true,
        runValidators: true,
      });
      if (newImage && oldImage && newImage !== oldImage) {
        await removeFromFirebase(oldImage);
      }

      return updatedGift;
    } catch (error) {
      if (newImage && (!gift || newImage !== oldImage)) {
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
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    await gift.deleteOne();
    await removeFromFirebase(gift.image);
    return null;
  }

  static async createPackage(data) {
    return await giftcategoryModel.create(data);
  }

  static async getAllPackages(query) {
    const { page = 1, limit = 10, search = "" } = query;
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      giftcategoryModel
        .find(filter)
        .sort({ priority: 1 })
        .skip(skip)
        .limit(limit),
      giftcategoryModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  static async getPackageById(id) {
    const pkg = await giftcategoryModel.findById(id);
    if (!pkg) {
      throw new AppError("Package not found", HTTPStatusCode.NOT_FOUND);
    }
    return pkg;
  }

  static async updatePackage(id, data) {
    const pkg = await giftcategoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      throw new AppError("Package not found", HTTPStatusCode.NOT_FOUND);
    }
    return pkg;
  }

  static async deletePackage(id) {
    const pkg = await giftcategoryModel.findByIdAndDelete(id);
    if (!pkg) {
      throw new AppError("Package not found", HTTPStatusCode.NOT_FOUND);
    }
    return true;
  }
}
