import Joi from "joi";
import { Role } from "../../utils/constants.js";
export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().allow("", null),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid(Role.ADMIN, Role.USER),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long.",
  }),
});

export const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export const resendSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long.",
  }),
  oldPassword: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long.",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  user: Joi.object(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});
