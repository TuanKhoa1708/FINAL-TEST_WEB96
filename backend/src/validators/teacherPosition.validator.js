const Joi = require('joi');


const createTeacherPositionSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'any.required': 'Code is required',
    'string.empty': 'Code cannot be empty',
  }),
  name: Joi.string().trim().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  des: Joi.string().trim().allow('').optional(),
  isActive: Joi.boolean().optional().default(true),
});


module.exports = {
  createTeacherPositionSchema,
};
