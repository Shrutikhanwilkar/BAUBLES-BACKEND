// middleware/validation.middleware.js
import HTTPStatusCode from "../utils/httpStatusCode.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // `abortEarly: false` returns all validation errors
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return {
        path: detail.path[0],
        message: detail.message.replace(/['"]/g, ''),
      };
    });

    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: errorDetails,
    });
  }

  next();
};

