import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import childrenRouter from "../modules/children/children.route.js";
import contactUsRouter from "../modules/contactUS/contactUs.route.js"
import adminRouter from "../modules/admin/admin.route.js"
import staticPageRouter from "../modules/staticPage/staticPage.route.js"
import UserRoutes from "../modules/user/user.route.js"
import messageRoutes from "../modules/message/message.route.js"
const router = Router();

router.use("/auth", authRouter);
router.use("/children", childrenRouter);
router.use("/contact-us", contactUsRouter);
router.use("/static-page", staticPageRouter);
router.use("/admin", adminRouter);
router.use("/user", UserRoutes);
router.use("/message", messageRoutes);


export default router;
