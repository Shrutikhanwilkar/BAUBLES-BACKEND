import { Router } from "express";
import ContactUsController from "./contactUs.controller.js";
import { addContactSchema } from "./contactUs.validation.js";
import { validate } from "../../middleware/validation.js";

const router = Router()

router.post("/create", validate(addContactSchema), ContactUsController.create)
export default router;