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
    let nice = await StatusCategory.findOne({ colourName: "green" });
    let naughty = await StatusCategory.findOne({ colourName: "red" });
    const commonTotalsPromise = Promise.all([
      this.totalChildCount(),
      this.totalNiceCount(nice._id),
      this.totalNaughtyCount(naughty._id),
    ]);

    let typeSpecificPromise;

    switch (type) {
      case "popular":
        typeSpecificPromise = Promise.all([
          this.top20PopularBoysName(),
          this.top20PopularGirlsName(),
        ]);
        break;

      case "behaviour":
        typeSpecificPromise = Promise.all([
          this.top20NiceChildren(nice._id),
          this.top20NaughtyChildren(naughty._id),
        ]);
        break;

      case "state":
        typeSpecificPromise = this.stateWiseNiceNaughty(nice._id, naughty._id);
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
      const [top20BoysName, top20GirlsName] = typeData;
      data = { top20BoysName, top20GirlsName };
    }

    if (type === "behaviour") {
      const [topNice, topNaughty] = typeData;
      data = { topNice, topNaughty };
    }

    if (type === "state") {
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

  static async totalNiceCount(category) {
    return await messageModel.countDocuments({ statusCategoryId: category });
  }

  static async totalNaughtyCount(category) {
    return await messageModel.countDocuments({ statusCategoryId: category });
  }

  // ================= POPULAR =================

  static async top20PopularBoysName() {
    let res = await Children.aggregate([
      {
        $match: {
          firstName: { $ne: null, $ne: "" },
          gender: "male",
        },
      },
      {
        $group: {
          _id: { $toLower: "$firstName" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, firstName: 1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          firstName: "$_id",
          count: 1,
        },
      },
    ]);
    return res;
  }

  static async top20PopularGirlsName() {
    let res = await Children.aggregate([
      {
        $match: {
          firstName: { $ne: null, $ne: "" },
          gender: "female",
        },
      },
      {
        $group: {
          _id: { $toLower: "$firstName" }, // merge Aman, aman, AMAN
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, firstName: 1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          firstName: "$_id",
          count: 1,
        },
      },
    ]);
    return res;
  }

  // ================= BEHAVIOUR =================

  static async top20NiceChildren(category) {
    return this.topByBehaviour(category);
  }

  static async top20NaughtyChildren(category) {
    return this.topByBehaviour(category);
  }

  static async topByBehaviour(category) {
    let res = await messageModel.aggregate([
      {
        $match: {
          statusCategoryId: category,
        },
      },
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
            childId: "$childId",
            statusCategoryId: "$statusCategoryId",
          },
          firstName: { $first: "$child.firstName" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1, firstName: 1 },
      },
      {
        $project: {
          _id: 0,
          childId: "$_id.childId",
          statusCategoryId: "$_id.statusCategoryId",
          firstName: 1,
          count: 1,
        },
      },
    ]);
    return res;
  }

  // ================= STATE =================

  static async stateWiseNiceNaughty(niceCategoryId, naughtyCategoryId) {
    const niceId = niceCategoryId;
    const naughtyId = naughtyCategoryId;

    const res = await messageModel.aggregate([
      {
        $lookup: {
          from: "childrens",
          localField: "childId",
          foreignField: "_id",
          as: "child",
        },
      },
      { $unwind: "$child" },

      // 🔥 FIRST GROUP: state + statusCategoryId (from messageModel)
      {
        $group: {
          _id: {
            state: "$child.state",
            statusCategoryId: "$statusCategoryId",
          },
          count: { $sum: 1 },
        },
      },

      // 🔥 SECOND GROUP: pivot nice / naughty
      {
        $group: {
          _id: "$_id.state",
          nice: {
            $sum: {
              $cond: [{ $eq: ["$_id.statusCategoryId", niceId] }, "$count", 0],
            },
          },
          naughty: {
            $sum: {
              $cond: [
                { $eq: ["$_id.statusCategoryId", naughtyId] },
                "$count",
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          state: "$_id",
          nice: 1,
          naughty: 1,
        },
      },
    ]);

    return res;
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
