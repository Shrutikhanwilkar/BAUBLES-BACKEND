import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";

import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import ReportService from "./report.service.js";
export default class ReportController {
  static listChildrenByBehaviourCategory = asyncHandler(async (req, res) => {
    const data = await ReportService.listChildrenByBehaviourCategory(
      req.params.categoryId,
      req.query
    );

    return sendSuccess(
      res,
      data,
      "Children fetched successfully",
      HTTPStatusCode.OK
    );
  });
  static async reportDashbaord(req, res) {
    try {
      const data = await ReportService.reportDashbaord(req.query);
      return sendSuccess(
        res,
        data,
        "Reports fetched successfully",
        HTTPStatusCode.OK
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Dashboard fetch failed",
      });
    }
  }

  static async reportListByState(req, res) {
    try {
      const data = await ReportService.reportListByState(req.query);
      return sendSuccess(
        res,
        data,
        "Reports fetched successfully",
        HTTPStatusCode.OK
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Dashboard fetch failed",
      });
    }
  }
}
