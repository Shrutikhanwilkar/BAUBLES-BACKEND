import { Router } from "express";
import ChildrenController from "./children.controller.js";
import authenticateToken from "../../middleware/checkAuthToken.js";
import { addChildSchema, updateChildSchema } from "./children.validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadSingleToS3 } from "../../middleware/s3Upload.js";
const childrenRouter = Router();

childrenRouter.post(
  "/add",
  uploadSingleToS3("avatar"),
  validate(addChildSchema),
  authenticateToken,
  ChildrenController.addChild
);
childrenRouter.put(
  "/update/:id",
  uploadSingleToS3("avatar"),
  validate(updateChildSchema),
  authenticateToken,
  ChildrenController.updateChild
);
childrenRouter.get("/list", authenticateToken, ChildrenController.listChildren);
childrenRouter.get(
  "/last-message",
  authenticateToken,
  ChildrenController.listChildrenWithLastMessage
);
childrenRouter.delete(
  "/delete/:id",
  authenticateToken,
  ChildrenController.deleteChild
);
childrenRouter.put(
  "/update-avatar/:childId",
  uploadSingleToS3("avatar"),
  authenticateToken,
  ChildrenController.updateAvatar
);

export default childrenRouter;
