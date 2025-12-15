import mongoose from "mongoose";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import messageModel from "../../../models/message.model.js";
import { Pagination } from "../../../utils/constants.js";
import Children from "../../../models/children.model.js";
import StatusCategory from "../../../models/statusCategory.model.js";
export default class ReportService {
  static async listChildrenByBehaviourCategory(categoryId, reqQuery) {
    let page = reqQuery.page || Number(Pagination.Page);
    let limit = reqQuery.limit || Number(Pagination.Limit);
    const skip = (page - 1) * limit;

    let query = {
      statusCategoryId: new mongoose.Types.ObjectId(categoryId),
    };
    let childQuery = {};
    if (reqQuery.search) {
      childQuery.firstName = { $regex: reqQuery.search, $options: "i" };
    }

    if (reqQuery.state) {
      childQuery.state = reqQuery.state;
    }

    if (reqQuery.fromDate && reqQuery.toDate) {
      query.createdAt = {
        $gte: new Date(reqQuery.fromDate),
        $lte: new Date(reqQuery.toDate),
      };
    }
    console.log(query, "--------");
    const result = await messageModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "statuscategories",
          localField: "statusCategoryId",
          foreignField: "_id",
          as: "statusCategory",
        },
      },
      { $unwind: "$statusCategory" },
      {
        $lookup: {
          from: "childrens",
          localField: "childId",
          foreignField: "_id",
          as: "children",
          pipeline: [{ $match: childQuery }],
        },
      },
      { $unwind: "$children" },
      {
        $lookup: {
          from: "users",
          localField: "children.parentId",
          foreignField: "_id",
          as: "parent",
        },
      },
      { $unwind: "$parent" },
      {
        $project: {
          createdAt: 1,
          updatedAt: 1,
          "statusCategory._id": 1,
          "statusCategory.name": 1,
          "statusCategory.color": 1,
          "statusCategory.description": 1,
          "parent.name": 1,
          "parent.email": 1,
          "parent.mobile": 1,
          children: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const report = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      data: report,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async reportDashbaord(query) {
    const { type } = query;

    // 🔹 COMMON TOTALS (always required)
    const commonTotalsPromise = Promise.all([
      this.totalChildCount(),
      this.totalNiceCount(),
      this.totalNaughtyCount(),
    ]);

    let typeSpecificPromise;

    // 🔹 TYPE-BASED LOGIC
    switch (type) {
      case "popular":
        typeSpecificPromise = Promise.all([
          this.top20NiceBoys(),
          this.top20NiceGirls(),
        ]);
        break;

      case "behaviour":
        typeSpecificPromise = Promise.all([
          this.top20NiceChildren(),
          this.top20NaughtyChildren(),
        ]);
        break;

      case "status":
        typeSpecificPromise = this.stateWiseNiceNaughty();
        break;

      default:
        throw new Error("Invalid dashboard type");
    }

    // 🔹 PARALLEL EXECUTION
    const [[totalChildren, totalNice, totalNaughty], typeData] =
      await Promise.all([commonTotalsPromise, typeSpecificPromise]);

    // 🔹 FORMAT RESPONSE
    let data = {};

    if (type === "popular") {
      const [topNiceBoys, topNiceGirls] = typeData;
      data = { topNiceBoys, topNiceGirls };
    }

    if (type === "behaviour") {
      const [topNice, topNaughty] = typeData;
      data = { topNice, topNaughty };
    }

    if (type === "status") {
      data = typeData;
    }

    return {
      totalChildren,
      totalNice,
      totalNaughty,
      data,
    };
  }

  // ================= TOTALS =================

  static async totalChildCount() {
    const childCount = await Children.countDocuments();
    return childCount;
  }

  static async totalNiceCount() {
    return messageModel.countDocuments({ status: "NICE" });
  }

  static async totalNaughtyCount() {
    return messageModel.countDocuments({ status: "NAUGHTY" });
  }

  // ================= POPULAR =================

  static async top20NiceBoys() {
    return this._topNiceByGender("BOY");
  }

  static async top20NiceGirls() {
    return this._topNiceByGender("GIRL");
  }

  static async _topNiceByGender(gender) {
    return messageModel.aggregate([
      { $match: { status: "NICE" } },
      {
        $lookup: {
          from: "childrens",
          localField: "childId",
          foreignField: "_id",
          as: "child",
        },
      },
      { $unwind: "$child" },
      { $match: { "child.gender": gender } },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          childId: "$child._id",
          name: "$child.firstName",
          gender: "$child.gender",
        },
      },
    ]);
  }

  // ================= BEHAVIOUR =================

  static async top20NiceChildren() {
    return this._topByBehaviour("NICE");
  }

  static async top20NaughtyChildren() {
    return this._topByBehaviour("NAUGHTY");
  }

  static async _topByBehaviour(status) {
    return messageModel.aggregate([
      { $match: { status } },
      {
        $lookup: {
          from: "childrens",
          localField: "childId",
          foreignField: "_id",
          as: "child",
        },
      },
      { $unwind: "$child" },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          childId: "$child._id",
          name: "$child.firstName",
          status,
        },
      },
    ]);
  }

  // ================= STATUS =================

  static async stateWiseNiceNaughty() {
    return messageModel.aggregate([
      {
        $lookup: {
          from: "childrens",
          localField: "childId",
          foreignField: "_id",
          as: "child",
        },
      },
      { $unwind: "$child" },

      {
        $group: {
          _id: {
            state: "$child.state",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },

      {
        $group: {
          _id: "$_id.state",
          data: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          state: "$_id",
          nice: {
            $sum: {
              $map: {
                input: "$data",
                as: "d",
                in: {
                  $cond: [{ $eq: ["$$d.status", "NICE"] }, "$$d.count", 0],
                },
              },
            },
          },
          naughty: {
            $sum: {
              $map: {
                input: "$data",
                as: "d",
                in: {
                  $cond: [{ $eq: ["$$d.status", "NAUGHTY"] }, "$$d.count", 0],
                },
              },
            },
          },
        },
      },
    ]);
  }

  static async reportListByState(reqQuery) {
    const AU_STATES_FULL = [
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "South Australia",
      "Tasmania",
      "Australian Capital Territory",
      "Northern Territory",
    ];

    //Normalize input state
    const inputState = reqQuery.state?.trim();

    // States to return (response side)
    const statesToProcess = inputState
      ? AU_STATES_FULL.filter(
          (s) => s.toLowerCase() === inputState.toLowerCase()
        )
      : AU_STATES_FULL;

    if (!statesToProcess.length) {
      return [];
    }
    //Fetch categories
    const categories = await StatusCategory.find(
      {},
      { _id: 0, name: 1 }
    ).lean();

    const categoryNames = categories.map((c) => c.name);

    //Aggregation (CASE-INSENSITIVE MATCH)
    const rawCounts = await messageModel.aggregate([
      {
        $lookup: {
          from: "childrens",
          localField: "childId",
          foreignField: "_id",
          as: "child",
        },
      },
      { $unwind: "$child" },

      ...(inputState
        ? [
            {
              $match: {
                "child.state": {
                  $regex: `^${inputState}$`,
                  $options: "i",
                },
              },
            },
          ]
        : []),

      {
        $lookup: {
          from: "statuscategories",
          localField: "statusCategoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $group: {
          _id: {
            state: "$child.state",
            category: "$category.name",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    rawCounts.forEach(({ _id, count }) => {
      const normalizedState = statesToProcess.find(
        (s) => s.toLowerCase() === _id.state.toLowerCase()
      );

      if (!normalizedState) return;

      if (!countMap[normalizedState]) countMap[normalizedState] = {};
      countMap[normalizedState][_id.category] = count;
    });

    return statesToProcess.map((state) => {
      const categoriesObj = {};

      categoryNames.forEach((cat) => {
        categoriesObj[cat] = countMap[state]?.[cat] || 0;
      });

      return {
        state,
        categories: categoriesObj,
      };
    });
  }
}
