import { Router } from "express"
import authenticateToken from "../../middleware/checkAuthToken.js";
import UserController from "./user.controller.js";
import { updateUserSchema } from "./user.validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadSingleToFirebase } from "../../middleware/upload.js";

const router = Router()
router.get("/static-data", UserController.staticData)
router.get("/profile", authenticateToken, UserController.getProfile);
router.put("/update", validate(updateUserSchema), authenticateToken, UserController.updateProfile);
router.patch("/update-avatar", authenticateToken, uploadSingleToFirebase("avatar"), UserController.updateAvatar);
export default router