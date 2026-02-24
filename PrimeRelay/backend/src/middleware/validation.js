const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^(?:\+234|0)?[789][01]\d{8}$/).optional()
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// SMS campaign validation
const campaignSchema = Joi.object({
  senderId: Joi.string().min(3).max(11).required(),
  message: Joi.string().min(1).max(1600).required(),
  recipients: Joi.alternatives().try(
    Joi.array().items(Joi.string().pattern(/^(?:\+234|0)?[789][01]\d{8}$/)).min(1).max(10000),
    Joi.string().uuid() // contact list ID
  ).required(),
  scheduledAt: Joi.date().min('now').optional()
});

// Single SMS validation
const singleSmsSchema = Joi.object({
  senderId: Joi.string().min(3).max(11).required(),
  recipient: Joi.string().pattern(/^(?:\+234|0)?[789][01]\d{8}$/).required(),
  message: Joi.string().min(1).max(1600).required(),
  scheduledAt: Joi.date().min('now').optional()
});

// Contact list validation
const contactListSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(500).optional(),
  contacts: Joi.array().items(
    Joi.object({
      phone: Joi.string().pattern(/^(?:\+234|0)?[789][01]\d{8}$/).required(),
      firstName: Joi.string().max(100).optional(),
      lastName: Joi.string().max(100).optional(),
      email: Joi.string().email().optional()
    })
  ).min(1).required()
});

// Sender ID validation
const senderIdSchema = Joi.object({
  senderName: Joi.string().min(3).max(11).pattern(/^[a-zA-Z0-9]+$/).required()
});

// Payment validation
const paymentSchema = Joi.object({
  amount: Joi.number().min(100).max(1000000).required(),
  paymentMethod: Joi.string().valid('paystack').required()
});

// API key validation
const apiKeySchema = Joi.object({
  keyName: Joi.string().min(2).max(100).required(),
  permissions: Joi.array().items(Joi.string().valid('send_sms', 'view_reports', 'manage_contacts')).default(['send_sms'])
});

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ 
        error: 'Validation failed', 
        errors 
      });
    }

    req.validatedBody = value;
    next();
  };
}

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  campaignSchema,
  singleSmsSchema,
  contactListSchema,
  senderIdSchema,
  paymentSchema,
  apiKeySchema
};
