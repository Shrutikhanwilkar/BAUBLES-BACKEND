import { Router } from "express";
import ChildrenController from "./children.controller.js";
import authenticateToken from "../../middleware/checkAuthToken.js";
import { addChildSchema, updateChildSchema } from "./input.validation.js";
import { validate } from "../../middleware/validation.js";
const childrenRouter = Router()


childrenRouter.post("/add", validate(addChildSchema), authenticateToken, ChildrenController.addChild);
childrenRouter.put("/update/:id", validate(updateChildSchema), authenticateToken, ChildrenController.updateChild);
childrenRouter.get("/list", authenticateToken, ChildrenController.listChildren);
childrenRouter.delete("/delete/:id", authenticateToken, ChildrenController.deleteChild);

export default childrenRouter

