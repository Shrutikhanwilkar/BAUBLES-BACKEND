import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import CommonController from "./common.controller.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "./common.validation.js";
import { validate } from "../../../middleware/validation.js";
import { uploadSingleToFirebase } from "../../../middleware/upload.js";

const router = Router();
router.use(authenticateToken);

router.get("/profile", CommonController.getProfile);
router.put(
  "/change-password",
  validate(changePasswordSchema),
  CommonController.changePassword
);
router.put(
  "/update-profile",
  uploadSingleToFirebase("avatar"),
  validate(updateProfileSchema),
  CommonController.updateProfile
);
router.post(
  "/upload-avatar",
  uploadSingleToFirebase("avatar"),
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

export default router;
