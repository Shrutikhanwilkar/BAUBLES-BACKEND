import { Router } from "express";
import StaticPageController from "./staticPage.controller.js";

const router = Router();

router.post("/create", StaticPageController.addPage);
router.put("/update", StaticPageController.updatePage);
router.get("/list", StaticPageController.listPages);
router.get("/:pageId", StaticPageController.getPage);
router.delete("/delete/:pageId", StaticPageController.deletePage);

export default router;