import { Router } from "express";
import AuthController from "./auth.controller.js"
import { validate } from "../../../middleware/validation.js";
import { loginSchema,} from "./auth.validation.js";


const authRouter = Router();

authRouter.post("/login", validate(loginSchema), AuthController.login);


export default authRouter;
