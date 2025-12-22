import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import AudioPlayBackController from "./audioPlayback.controller.js";
import { uploadMultipleToS3 } from "../../../middleware/s3Upload.js";

const router = Router();
router.use(authenticateToken);

router.post(
  "/add",
  uploadMultipleToS3([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  AudioPlayBackController.addAudioPlayBack
);

router.get("/list", AudioPlayBackController.getAllAudioPlayBack);

// UPDATE
router.patch(
  "/update/:id",
  uploadMultipleToS3([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  AudioPlayBackController.updateAudioPlayBack
);

// DELETE
router.delete("/delete/:id", AudioPlayBackController.deleteAudioPlayBack);
export default router;
