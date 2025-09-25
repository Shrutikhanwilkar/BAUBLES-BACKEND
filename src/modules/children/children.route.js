import { Router } from "express";
import ChildrenController from "./children.controller.js";
import authenticateToken from "../../middleware/checkAuthToken.js";
import { addChildSchema, updateChildSchema } from "./children.validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadSingleToFirebase } from "../../middleware/upload.js";
const childrenRouter = Router()


childrenRouter.post("/add", uploadSingleToFirebase("avatar"), validate(addChildSchema), authenticateToken, ChildrenController.addChild);
childrenRouter.put("/update/:id", uploadSingleToFirebase("avatar"), validate(updateChildSchema), authenticateToken, ChildrenController.updateChild);
childrenRouter.get("/list", authenticateToken, ChildrenController.listChildren);
childrenRouter.delete("/delete/:id", authenticateToken, ChildrenController.deleteChild);
childrenRouter.patch("/update-avatar/:childId", authenticateToken, uploadSingleToFirebase("avatar"), ChildrenController.updateAvatar);

export default childrenRouter
