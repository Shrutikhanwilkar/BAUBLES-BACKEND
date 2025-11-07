import { Router } from "express";
import staticPageRouter from "../admin/staticPage/staticPage.route.js"
import contactUsRoute from "../admin/contactUS/contactUs.route.js"
import authRoute from "../admin/auth/auth.route.js"
import statusCategoryRoutes from "./statusCategory/statusCategory.route.js"
import musicRoutes from "./music/music.route.js"
import giftRoutes from "./gift/gift.route.js"
import AuthController from "./auth/auth.controller.js";
import authenticateToken from "../../middleware/checkAuthToken.js";
import { changePasswordSchema, updateProfileSchema } from "./auth/auth.validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadSingleToFirebase } from "../../middleware/upload.js";
import AdminController from "./admin.controller.js";
import userRoutes from "./user/user.route.js"
import childrenRoutes from "./children/children.route.js"
const router = Router()
router.use("/user", userRoutes)
router.use("/children", childrenRoutes)
router.use("/static-page", staticPageRouter)
router.use("/contact-us", contactUsRoute)
router.use("/status", statusCategoryRoutes)
router.use("/music", musicRoutes)
router.use("/gift", giftRoutes)
router.use("/auth", authRoute)
router.get("/profile", authenticateToken, AuthController.getProfile)
router.put("/change-password", validate(changePasswordSchema), authenticateToken, AuthController.changePassword)
router.put("/update-profile",
    validate(updateProfileSchema),
    // uploadSingleToFirebase("avatar"),
    authenticateToken,
    AuthController.updateProfile)
router.get("/dashboard-stats", authenticateToken, AdminController.getDashboardStats)

export default router;