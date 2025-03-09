import Joi from "joi";

export const userSchema = Joi.object().keys({
  firstName: Joi.string().alphanum().required(),
  lastName: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  role: Joi.string(),
  password: Joi.string()
    .required()
    .min(6)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .strict(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required().strict(),
});
