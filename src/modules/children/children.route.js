import { Router } from "express";
import ChildrenController from "./children.controller.js";
import authenticateToken from "../../middleware/checkAuthToken.js";
const childrenRouter = Router()


childrenRouter.post("/add", authenticateToken, ChildrenController.addChild);
childrenRouter.put("/update/:id", authenticateToken, ChildrenController.updateChild);
childrenRouter.get("/list", authenticateToken, ChildrenController.listChildren);

export default childrenRouter

