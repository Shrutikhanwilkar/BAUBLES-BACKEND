import Joi from "joi";

export const addContactSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    countryCode:Joi.string().required(),
    mobile: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .messages({
            "string.pattern.base": "Mobile number must be between 10 to 15 digits",
        }),
    message: Joi.string().min(5).max(1000).required(),
    type: Joi.string()
        .valid("Other", "App Question", "Bauble Question", "Support")
        .default("Other"),
});
