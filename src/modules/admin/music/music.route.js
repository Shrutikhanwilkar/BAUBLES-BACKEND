import { Router } from "express";
import MusicController from "./music.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import { uploadSingleToS3 } from "../../../middleware/s3Upload.js";
const router = Router();

router.use(authenticateToken);

router.post("/create", uploadSingleToS3("musicFile"), MusicController.addMusic);
router.put("/update/:musicId", MusicController.updateMusic);
router.get("/list", MusicController.listMusic);
router.get("/:musicId", MusicController.getMusic);
router.delete("/:musicId", MusicController.deleteMusic);

export default router;
