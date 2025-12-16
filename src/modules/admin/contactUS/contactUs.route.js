import { Router } from "express";
import ContactUsController from "./contactUs.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";
import { uploadArrayToFirebase } from "../../../middleware/upload.js";
const router = Router()
router.use(authenticateToken);
// router.post("/create", ContactUsController.create)
router.get("/list", ContactUsController.listContacts)
router.get("/details/:id", ContactUsController.getContact)
router.delete("/delete/:id", ContactUsController.deleteContact)
router.patch(
  "/update/:id",
  uploadArrayToFirebase("solutionImages"),
  ContactUsController.updateContactQuery
);

export default router;