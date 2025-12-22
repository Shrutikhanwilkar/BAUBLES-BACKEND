import { Router } from "express";
import GiftController from "./gift.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import { uploadSingleToS3 } from "../../../middleware/s3Upload.js";

const router = Router();
router.use(authenticateToken);
router.post("/create", uploadSingleToS3("image"), GiftController.create);
router.get("/list", GiftController.listGifts);
router.get("/:id", GiftController.getGift);
router.put("/update/:id", uploadSingleToS3("image"), GiftController.updateGift);
router.delete("/delete/:id", GiftController.deleteGift);
router.post("/package/create", GiftController.createPackage);
router.get("/package/list", GiftController.listPackages);
router.get("/package/detail/:id", GiftController.packageDetail);
router.put("/package/update/:id", GiftController.updatePackage);
router.delete("/package/delete/:id", GiftController.deletePackage);
export default router;
