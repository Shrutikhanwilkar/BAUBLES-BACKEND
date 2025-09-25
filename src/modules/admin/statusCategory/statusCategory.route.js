import { Router } from "express";
import StatusCategoryController from "./statusCategory.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import { validate } from "../../../middleware/validation.js";
import { addCategorySchema, updateCategorySchema } from "./statusCategory.validation.js";

const router = Router();

router.use(authenticateToken);

router.post("/create", validate(addCategorySchema), StatusCategoryController.addCategory);
router.put("/update/:categoryId", validate(updateCategorySchema), StatusCategoryController.updateCategory);
router.get("/list", StatusCategoryController.listCategories);
router.get("/:categoryId", StatusCategoryController.getCategory);
// router.delete("/delete/:categoryId", StatusCategoryController.deleteCategory);

export default router;
