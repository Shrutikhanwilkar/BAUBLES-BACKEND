import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import { uploadMultipleToFirebase } from "../../../middleware/upload.js";
import AudioPlayBackController from "./audioPlayback.controller.js";

const router = Router();
router.use(authenticateToken);

router.post(
  "/add",
  uploadMultipleToFirebase([
    { name: "videoFile", maxCount: 1 },
     { name: "thumbnail", maxCount: 1 },
  ]),
  AudioPlayBackController.addAudioPlayBack
);

router.get("/list", AudioPlayBackController.getAllAudioPlayBack);

// UPDATE
router.patch("/update/:id", AudioPlayBackController.updateAudioPlayBack);

// DELETE
router.delete("/delete/:id", AudioPlayBackController.deleteAudioPlayBack);
export default router;
