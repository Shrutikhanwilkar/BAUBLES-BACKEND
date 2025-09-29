import { Router } from "express";
import MessageController from "./Message.controller.js";
import authenticateToken from "../../../middleware/checkAuthToken.js";

const router = Router();
router.use(authenticateToken);

router.post("/send", MessageController.sendMessage);
router.get("/child/:childId/messages", MessageController.listMessages);
router.get("/children/last-message", MessageController.listChildrenWithLastMessage);

export default router;
