import { Router } from "express";
import GiftController from "./gift.controller.js";
import authenticateToken from "../../middleware/checkAuthToken.js";

const router = Router();
router.use(authenticateToken);
router.get("/list", GiftController.getRandomGift);
router.get("/random-gift", GiftController.getRandomGift);
router.get("/:id", GiftController.getGift);

export default router;
