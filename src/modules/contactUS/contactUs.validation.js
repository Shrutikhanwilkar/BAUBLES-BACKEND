import Joi from "joi";

export const addContactSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/).optional()
        .messages({
            "string.pattern.base": "Mobile number must be 10 to 15 digits only",
        }),
    message: Joi.string().min(5).max(500).required(),
});