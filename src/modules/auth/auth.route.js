import { Router } from "express";
import  {AuthController}  from "./auth.controller.js";
import { validate } from "../../middleware/validation.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, resendSchema, signupSchema, verifySchema } from "./auth.validation.js";
import authenticateToken from "../../middleware/checkAuthToken.js";
const authController = new AuthController();
const authRouter = Router();

authRouter.post("/signup",  validate(signupSchema),authController.register);
authRouter.post("/login",  validate(loginSchema),authController.login);
authRouter.post("/verify-otp",  validate(verifySchema),authController.verifyOtp);
authRouter.post("/resend-otp",  validate(resendSchema),authController.resendOtp);
authRouter.post("/change-password", authenticateToken, validate(changePasswordSchema),authController.changePassword);
authRouter.post("/forgot-password",  validate(forgotPasswordSchema),authController.forgotPassword);

export default authRouter;
