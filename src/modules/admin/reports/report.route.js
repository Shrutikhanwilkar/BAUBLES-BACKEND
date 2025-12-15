import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import ReportController from "./report.controller.js";

const router = Router();

router.use(authenticateToken);

router.get(
  "/category/:categoryId",
  ReportController.listChildrenByBehaviourCategory
);

router.get(
  "/dashbaord",
  ReportController.reportDashbaord
);

router.get("/list-by-state", ReportController.reportListByState);

export default router;
