import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import UserController from "./user.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/list", UserController.listUsers);
router.get("/:id", UserController.getUserDetails);

export default router;
