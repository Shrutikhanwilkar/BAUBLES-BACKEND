import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import childrenRouter from "../modules/children/children.route.js";
const router = Router();

router.use("/auth", authRouter);
router.use("/children", childrenRouter);

export default router;
