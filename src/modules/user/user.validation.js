import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
});
