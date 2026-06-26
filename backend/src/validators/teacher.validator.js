const Joi = require('joi');


const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .lowercase()
  .trim()
  .required()
  .messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  });

const phoneSchema = Joi.string()
  .pattern(/^[0-9]{9,15}$/)
  .trim()
  .optional()
  .messages({
    'string.pattern.base': 'Phone number must contain 9–15 digits only',
  });

const objectIdSchema = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .messages({
    'string.pattern.base': 'Must be a valid MongoDB ObjectId (24 hex characters)',
  });

const degreeSchema = Joi.object({
  type: Joi.string().trim().required().messages({
    'any.required': 'Degree type is required',
    'string.empty': 'Degree type cannot be empty',
  }),
  school: Joi.string().trim().required().messages({
    'any.required': 'School name is required',
    'string.empty': 'School name cannot be empty',
  }),
  major: Joi.string().trim().optional(),
  graduationYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      'number.min': 'Graduation year must be 1900 or later',
      'number.max': `Graduation year cannot exceed ${new Date().getFullYear()}`,
    }),
});


const createTeacherSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    'any.required': 'Full name is required',
    'string.empty': 'Full name cannot be empty',
  }),
  email: emailSchema,
  phoneNumber: phoneSchema,
  address: Joi.string().trim().optional(),
  identityNumber: Joi.string()
    .pattern(/^[0-9]{9,12}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Identity number must be 9–12 digits',
    }),
  dateOfBirth: Joi.date().iso().optional().messages({
    'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD)',
  }),
  status: Joi.string().valid('active', 'inactive').optional().default('active'),
  teacherPositions: Joi.array().items(objectIdSchema).optional().default([]),
  degrees: Joi.array().items(degreeSchema).optional().default([]),
});

module.exports = {
  createTeacherSchema,
};
