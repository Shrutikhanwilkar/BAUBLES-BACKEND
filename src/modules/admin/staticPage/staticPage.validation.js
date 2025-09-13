import Joi from "joi";

export const addPageSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
});

export const updatePageSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).optional(),
});
