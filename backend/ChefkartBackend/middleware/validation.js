const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Chef validation
const validateChef = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
    body('city').trim().isLength({ min: 2 }).withMessage('City is required'),
    body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    body('starRating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    handleValidationErrors
];

// User validation
const validateUser = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

// Booking validation
const validateBooking = [
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('chefId').isMongoId().withMessage('Valid chef ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    handleValidationErrors
];

module.exports = {
    validateChef,
    validateUser,
    validateBooking,
    handleValidationErrors
};
