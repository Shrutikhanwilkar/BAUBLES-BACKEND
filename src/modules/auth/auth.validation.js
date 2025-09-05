import Joi from "joi";
import { Role } from "../../utils/contants.js";
export const signupSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional().allow("",null),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,8}$")).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid(Role.ADMIN, Role.USER),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,8}$")).required(),
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
    .pattern(new RegExp("^[a-zA-Z0-9]{3,8}$"))
    .required(),
  newPassword: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,8}$"))
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  user:Joi.object()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,8}$"))
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});
