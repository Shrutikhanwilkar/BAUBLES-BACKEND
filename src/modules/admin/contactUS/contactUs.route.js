import { Router } from "express";
import ContactUsController from "./contactUs.controller.js";

const router = Router()

// router.post("/create", ContactUsController.create)
router.get("/list", ContactUsController.listContacts)
router.get("/details/:id", ContactUsController.getContact)
router.delete("/delete/:id", ContactUsController.deleteContact)

export default router;