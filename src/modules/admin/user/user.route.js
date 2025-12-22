import { Router } from "express";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import UserController from "./user.controller.js";
import { isSuperAdmin } from "../../../middleware/checkIsSuperAdmin.js";
import { uploadSingleToS3 } from "../../../middleware/s3Upload.js";
const router = Router();

router.use(authenticateToken);

router.get("/list", authenticateToken, UserController.listUsers);
router.get("/:id", authenticateToken, UserController.getUserDetails);
router.get(
  "/child/detail/:id",
  authenticateToken,
  UserController.getChildDetails
);
// super admin can add edit delte admins
router.post(
  "/admin/add",
  uploadSingleToS3("avatar"),
  authenticateToken,
  isSuperAdmin,
  UserController.addAdmin
);
router.get(
  "/admin/list",
  authenticateToken,
  isSuperAdmin,
  UserController.listAdmins
);
router.get(
  "/admin/detail/:id",
  authenticateToken,
  isSuperAdmin,
  UserController.getAdminDetail
);
router.put(
  "/admin/edit/:id",
  uploadSingleToS3("avatar"),
  authenticateToken,
  isSuperAdmin,
  UserController.editAdmin
);
router.delete(
  "/admin/delete/:id",
  authenticateToken,
  isSuperAdmin,
  UserController.deleteAdmin
);

router.put(
  "/update-user-status/:id",
  authenticateToken,
  UserController.updateUserStatus
);

export default router;
