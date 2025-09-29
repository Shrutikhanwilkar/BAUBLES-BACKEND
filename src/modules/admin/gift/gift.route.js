import { Router } from "express";
import GiftController from "./gift.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import { uploadSingleToFirebase } from "../../../middleware/upload.js";

const router = Router();
router.use(authenticateToken);
router.post("/create", uploadSingleToFirebase("image"), GiftController.create);
router.get("/list", GiftController.listGifts);
router.get("/:id", GiftController.getGift);
router.put("/update/:id", GiftController.updateGift);
router.delete("/delete/:id", GiftController.deleteGift);

export default router;
