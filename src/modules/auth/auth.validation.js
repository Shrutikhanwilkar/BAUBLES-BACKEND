import Joi from "joi";
import { Role } from "../../utils/constants.js";
export const signupSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional().allow("",null),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{6,}$")
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid(Role.ADMIN, Role.USER),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export const resendSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required(),
  newPassword: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{6,}$")
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  user:Joi.object()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{6,}$")
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});
