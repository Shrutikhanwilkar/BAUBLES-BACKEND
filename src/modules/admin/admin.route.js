import { Router } from "express";
import staticPageRouter from "../admin/staticPage/staticPage.route.js"
import contactUsRoute from "../contactUS/contactUs.route.js"
import authRoute from "../admin/auth/auth.route.js"
import statusCategoryRoutes from "./statusCategory/statusCategory.route.js"

const router = Router()
router.use("/static-page", staticPageRouter)
router.use("/contact-us", contactUsRoute)
router.use("/status", statusCategoryRoutes)
router.use("/auth", authRoute)

export default router;