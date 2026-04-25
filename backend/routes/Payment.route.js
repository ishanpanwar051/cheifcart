const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controller/Payment.Controller');
const { authenticate } = require('../middleware/AuthMiddleware');

/**
 * POST /payment/create-payment-intent
 * Creates a Stripe PaymentIntent for booking payment
 * Requires: Authentication, bookingId, amount
 */
router.post('/create-payment-intent', authenticate, createPaymentIntent);

/**
 * POST /payment/webhook
 * Handles Stripe webhook events for payment confirmation
 * Public route (no authentication needed)
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

module.exports = router;
