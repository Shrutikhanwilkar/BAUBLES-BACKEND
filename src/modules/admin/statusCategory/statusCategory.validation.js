import Joi from "joi";

export const addCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(5).max(500).required(),
    color: Joi.string()
        .pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
        .required()
        .messages({
            "string.pattern.base": "Color must be a valid HEX code (e.g. #FF0000)",
        }),
    visibilityRank: Joi.number().integer().min(1).optional(),
    user: Joi.object().optional()
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(5).max(500).optional(),
    color: Joi.string()
        .pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
        .optional()
        .messages({
            "string.pattern.base": "Color must be a valid HEX code (e.g. #FF0000)",
        }),
    visibilityRank: Joi.number().integer().min(1).optional(),
    user: Joi.object().optional()
});
