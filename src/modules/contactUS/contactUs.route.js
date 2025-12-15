import { Router } from "express";
import ContactUsController from "./contactUs.controller.js";
import { addContactSchema } from "./contactUs.validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadArrayToFirebase, uploadMultipleToFirebase } from "../../middleware/upload.js";

const router = Router()

router.post("/create", validate(addContactSchema), uploadArrayToFirebase('images'),ContactUsController.create)
export default router;