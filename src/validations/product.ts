import Joi from "joi";

export const productSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  stock_quantity: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.string(),
});
