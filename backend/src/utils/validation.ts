import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
    }),
  profile: Joi.string().valid("admin", "user").default("user"),
});

export function validateUserData(data: any): { valid: boolean; errors?: any } {
  const { error } = userSchema.validate(data, { abortEarly: false });
  if (error) {
    return { valid: false, errors: error.details.map((err) => err.message) };
  }
  return { valid: true };
}