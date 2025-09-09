import Joi from "joi";

export const addChildSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  age: Joi.number().integer().min(0).max(18).required(),
  state: Joi.string().min(2).max(50).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
});
export const updateChildSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).optional(),
  age: Joi.number().integer().min(0).max(18).optional(),
  state: Joi.string().min(2).max(50).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
});