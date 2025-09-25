import Joi from "joi";

export const addChildSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  dob: Joi.date().less("now").required(), // must be a past date,
  state: Joi.string().min(2).max(50).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  avatar: Joi.string().optional(),
});
export const updateChildSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).optional(),
  dob: Joi.date().less("now").optional(),
  state: Joi.string().min(2).max(50).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  avatar: Joi.string().optional(),
});