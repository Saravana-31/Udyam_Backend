// Validation schemas and utilities using Joi
import Joi from "joi"

// Individual field validation schemas
const aadhaarSchema = Joi.string()
  .pattern(/^\d{12}$/)
  .required()
  .messages({
    "string.pattern.base": "Aadhaar must be exactly 12 digits",
    "any.required": "Aadhaar Number is required",
  })

const mobileSchema = Joi.string()
  .pattern(/^\d{10}$/)
  .required()
  .messages({
    "string.pattern.base": "Mobile number must be exactly 10 digits",
    "any.required": "Mobile Number is required",
  })

const panSchema = Joi.string()
  .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
  .required()
  .messages({
    "string.pattern.base": "PAN format should be ABCDE1234F (5 letters, 4 digits, 1 letter)",
    "any.required": "PAN Number is required",
  })

const otpSchema = Joi.string()
  .pattern(/^\d{6}$/)
  .required()
  .messages({
    "string.pattern.base": "OTP must be exactly 6 digits",
    "any.required": "OTP is required",
  })

const pincodeSchema = Joi.string()
  .pattern(/^\d{6}$/)
  .optional()
  .messages({
    "string.pattern.base": "PIN code must be exactly 6 digits",
  })

// Complete form validation schema
export const formValidationSchema = Joi.object({
  // Step 1 fields
  aadhaar: aadhaarSchema,
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name of Applicant is required",
  }),
  mobile: mobileSchema,
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email Address is required",
  }),
  otp: otpSchema,

  // Step 2 fields
  pan: panSchema,
  panName: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "PAN name must be at least 2 characters long",
    "string.max": "PAN name cannot exceed 100 characters",
    "any.required": "Name as per PAN is required",
  }),
  orgType: Joi.string().valid("Proprietorship", "Partnership", "Private Limited", "LLP").required().messages({
    "any.only": "Organisation Type must be one of: Proprietorship, Partnership, Private Limited, LLP",
    "any.required": "Organisation Type is required",
  }),
  incDate: Joi.date().iso().max("now").required().messages({
    "date.max": "Date of Incorporation cannot be in the future",
    "any.required": "Date of Incorporation is required",
  }),

  // Optional additional fields
  pincode: pincodeSchema,
  city: Joi.string().trim().min(2).max(50).optional(),
  state: Joi.string().trim().min(2).max(50).optional(),
})

// Validation middleware
export const validateFormData = (data: any) => {
  const { error, value } = formValidationSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })

  if (error) {
    const errors: Record<string, string> = {}
    error.details.forEach((detail) => {
      const field = detail.path.join(".")
      errors[field] = detail.message
    })
    return { isValid: false, errors, data: null }
  }

  return { isValid: true, errors: null, data: value }
}
