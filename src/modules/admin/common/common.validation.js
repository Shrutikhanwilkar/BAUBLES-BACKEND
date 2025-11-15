import Joi from "joi";

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),

  newPassword: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{6,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character",
      "string.empty": "New password is required",
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "any.required": "Confirm password is required",
    }),
});
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email address",
  }),
  mobile: Joi.string()
    .pattern(/^\+?\d{6,15}$/)
    .messages({
      "string.pattern.base":
        "Please provide a valid mobile number (6–15 digits, optional +country code)",
    }),
  avatar: Joi.string().uri().optional().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
  user: Joi.object(),
})
  .min(1) // ensure at least one field is provided
  .messages({
    "object.min":
      "At least one field (name, email, or avatar) must be provided",
  });