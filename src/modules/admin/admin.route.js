import { Router } from "express";
import staticPageRouter from "../admin/staticPage/staticPage.route.js"
import contactUsRoute from "../admin/contactUS/contactUs.route.js"
import authRoute from "../admin/auth/auth.route.js"
import statusCategoryRoutes from "./statusCategory/statusCategory.route.js"
import musicRoutes from "./music/music.route.js"
import giftRoutes from "./gift/gift.route.js";
import commonRoutes from './common/common.route.js';
import userRoutes from "./user/user.route.js"
import childrenRoutes from "./children/children.route.js"
import audioPlaybackModel from "../../models/audioPlayback.model.js";
import audioPlayBackRoutes from "./audioPlayback/audioPlayback.route.js";
import reportRoutes from './reports/report.route.js';
const router = Router()
router.use("/user", userRoutes)
router.use("/children", childrenRoutes)
router.use("/static-page", staticPageRouter)
router.use("/contact-us", contactUsRoute)
router.use("/status", statusCategoryRoutes)
router.use("/music", musicRoutes)
router.use("/gift", giftRoutes)
router.use("/auth", authRoute)
router.use("/", commonRoutes);
router.use("/audio-playback", audioPlayBackRoutes);
router.use("/reports", reportRoutes);
export default router;