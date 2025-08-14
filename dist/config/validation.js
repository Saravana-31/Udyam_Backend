"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormData = exports.formValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const aadhaarSchema = joi_1.default.string()
    .pattern(/^\d{12}$/)
    .required()
    .messages({
    "string.pattern.base": "Aadhaar must be exactly 12 digits",
    "any.required": "Aadhaar Number is required",
});
const mobileSchema = joi_1.default.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
    "string.pattern.base": "Mobile number must be exactly 10 digits",
    "any.required": "Mobile Number is required",
});
const panSchema = joi_1.default.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .required()
    .messages({
    "string.pattern.base": "PAN format should be ABCDE1234F (5 letters, 4 digits, 1 letter)",
    "any.required": "PAN Number is required",
});
const otpSchema = joi_1.default.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
    "string.pattern.base": "OTP must be exactly 6 digits",
    "any.required": "OTP is required",
});
const pincodeSchema = joi_1.default.string()
    .pattern(/^\d{6}$/)
    .optional()
    .messages({
    "string.pattern.base": "PIN code must be exactly 6 digits",
});
exports.formValidationSchema = joi_1.default.object({
    aadhaar: aadhaarSchema,
    name: joi_1.default.string().trim().min(2).max(100).required().messages({
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name of Applicant is required",
    }),
    mobile: mobileSchema,
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email Address is required",
    }),
    otp: otpSchema,
    pan: panSchema,
    panName: joi_1.default.string().trim().min(2).max(100).required().messages({
        "string.min": "PAN name must be at least 2 characters long",
        "string.max": "PAN name cannot exceed 100 characters",
        "any.required": "Name as per PAN is required",
    }),
    orgType: joi_1.default.string().valid("Proprietorship", "Partnership", "Private Limited", "LLP").required().messages({
        "any.only": "Organisation Type must be one of: Proprietorship, Partnership, Private Limited, LLP",
        "any.required": "Organisation Type is required",
    }),
    incDate: joi_1.default.date().iso().max("now").required().messages({
        "date.max": "Date of Incorporation cannot be in the future",
        "any.required": "Date of Incorporation is required",
    }),
    pincode: pincodeSchema,
    city: joi_1.default.string().trim().min(2).max(50).optional(),
    state: joi_1.default.string().trim().min(2).max(50).optional(),
});
const validateFormData = (data) => {
    const { error, value } = exports.formValidationSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        const errors = {};
        error.details.forEach((detail) => {
            const field = detail.path.join(".");
            errors[field] = detail.message;
        });
        return { isValid: false, errors, data: null };
    }
    return { isValid: true, errors: null, data: value };
};
exports.validateFormData = validateFormData;
//# sourceMappingURL=validation.js.map