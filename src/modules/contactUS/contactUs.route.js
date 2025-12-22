import { Router } from "express";
import ContactUsController from "./contactUs.controller.js";
import { addContactSchema } from "./contactUs.validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadArrayToFirebase, uploadMultipleToFirebase } from "../../middleware/upload.js";
import { uploadArrayToS3 } from "../../middleware/s3Upload.js";

const router = Router()

router.post("/create", validate(addContactSchema), uploadArrayToS3('images'),ContactUsController.create)
export default router;