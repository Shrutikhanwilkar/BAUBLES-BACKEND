import { Router } from "express";
import StaticPageController from "./staticPage.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";
const router = Router();
router.use(authenticateToken)
router.post("/create", StaticPageController.addPage);
router.put("/update/:pageId", StaticPageController.updatePage);
router.get("/list", StaticPageController.listPages);
router.get("/:pageId", StaticPageController.getPage);
router.delete("/delete/:pageId", StaticPageController.deletePage);

export default router;