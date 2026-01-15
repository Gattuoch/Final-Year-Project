import Joi from "joi";

export const registerValidator = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("camper", "camp_manager").default("camper"),
  country: Joi.string().optional(),
  
  // STRICT UPDATE: Only allows digits (0-9). No spaces, dashes, or plus signs.
  phone: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain only numbers (no spaces or symbols)."
    }),

  password: Joi.when("role", {
    is: "camp_manager",
    then: Joi.string()
      .min(12)
      .max(50)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{12,}$"))
      .required()
      .messages({
        "string.pattern.base": "Manager password must include upper/lowercase, number, and special character, at least 12 chars.",
      }),
    otherwise: Joi.string()
      .min(8)
      .max(50)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$"))
      .required()
      .messages({
        "string.pattern.base": "Camper password must include upper/lowercase, number, and special character, at least 8 chars.",
      }),
  }),

  // For camp manager only
  businessName: Joi.string().when("role", { is: "camp_manager", then: Joi.required() }),
  description: Joi.string().when("role", { is: "camp_manager", then: Joi.required() }),
  location: Joi.string().when("role", { is: "camp_manager", then: Joi.required() }),
  licenseUrl: Joi.string().when("role", { is: "camp_manager", then: Joi.required() }),
  contactEmail: Joi.string().email().when("role", { is: "camp_manager", then: Joi.required() }),
}).options({ stripUnknown: true }); // Prevents "confirmPassword is not allowed" error

export const loginValidator = Joi.object({
  // identifier must be provided
  identifier: Joi.string().required().messages({
    "any.required": "Email or Phone is required to login"
  }),
  password: Joi.string().required(),
});