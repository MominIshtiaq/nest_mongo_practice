import Joi from 'joi';

export const envValidation = Joi.object({
  MONGO_URI: Joi.string().required(),
});
