import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import CommonController from "./common.controller.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "./common.validation.js";
import { validate } from "../../../middleware/validation.js";
import { uploadSingleToS3 } from "../../../middleware/s3Upload.js";
const router = Router();
router.use(authenticateToken);

router.get("/profile", authenticateToken, CommonController.getProfile);
router.put(
  "/change-password",
  authenticateToken,
  validate(changePasswordSchema),
  CommonController.changePassword
);
router.put(
  "/update-profile",
  authenticateToken,
  uploadSingleToS3("avatar"),
  validate(updateProfileSchema),
  CommonController.updateProfile
);
router.post(
  "/upload-avatar",
  uploadSingleToS3("avatar"),
  CommonController.uploadAvatar
);
router.get(
  "/dashboard-stats",
  authenticateToken,
  CommonController.getDashboardStats
);

router.post(
  "/add-dashboard-link",
  authenticateToken,
  CommonController.addDashboardVedio
);

router.post(
  "/app-version-update",
  authenticateToken,
  CommonController.appVerisonUpdate
); // always upserts one
router.get("/app-version", authenticateToken, CommonController.appVersion);
// router.get("/app-version", authenticateToken, CommonController.appVersion);
router.post(
  "/broadcast/send",
  authenticateToken,
  CommonController.sendBroadcastToAll
);
router.get(
  "/broadcast/history",
  authenticateToken,
  CommonController.broadcastHistory
);
export default router;
