const Joi = require("joi");

const logSchema = Joi.object({
  level: Joi.string().valid("error", "warn", "info", "debug").required(),
  message: Joi.string().required(),
  resourceId: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  traceId: Joi.string().required(),
  spanId: Joi.string().required(),
  commit: Joi.string().required(),
  metadata: Joi.object().required(),
});

const validateLog = (req, res, next) => {
  const { error, value } = logSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Invalid log data",
      details: error.details[0].message,
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateLog,
  logSchema,
};
