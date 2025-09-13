import { Router } from "express";
import StaticPageController from "./staticPage.controller.js";

const router = Router()
router.get("/:slug", StaticPageController.getPageBySlug)

export default router