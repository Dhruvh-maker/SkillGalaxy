import { validationResult } from 'express-validator';

/**
 * Middleware to handle express-validator results
 * Returns 400 with error details if validation fails
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Extract error messages
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  };
};

export default validate;
