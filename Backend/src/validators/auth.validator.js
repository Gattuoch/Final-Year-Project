import Joi from "joi";

export const registerValidator = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("camper", "manager").default("camper"),
  password: Joi.when("role", {
    is: "manager",
    then: Joi.string()
      .min(12)
      .max(50)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{12,}$")
      )
      .required()
      .messages({
        "string.pattern.base":
          "Manager password must include upper/lowercase, number, and special character, at least 12 chars.",
      }),
    otherwise: Joi.string()
      .min(8)
      .max(50)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")
      )
      .required()
      .messages({
        "string.pattern.base":
          "Camper password must include upper/lowercase, number, and special character, at least 8 chars.",
      }),
  }),
  phone: Joi.string().optional(),

  // for camp manager only
  businessName: Joi.string().when("role", { is: "manager", then: Joi.required() }),
  description: Joi.string().when("role", { is: "manager", then: Joi.required() }),
  location: Joi.string().when("role", { is: "manager", then: Joi.required() }),
  licenseUrl: Joi.string().when("role", { is: "manager", then: Joi.required() }),
  contactEmail: Joi.string().email().when("role", { is: "manager", then: Joi.required() }),
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
