import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import ChildrenController from "./children.controller.js";

const router = Router();

router.use(authenticateToken);
router.get("/children", ChildrenController.listChildren);
router.get("/child/:id", ChildrenController.getChildById);

export default router;
