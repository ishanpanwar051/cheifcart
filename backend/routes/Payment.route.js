const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment,
  handleWebhook, 
  getPaymentStatus,
  refundPayment
} = require('../controller/Payment.Controller');
const { authenticate } = require('../middleware/AuthMiddleware');

/**
 * POST /payment/create-intent
 * Creates a Stripe PaymentIntent for booking payment
 * Requires: Authentication, bookingId, amount
 */
router.post('/create-intent', authenticate, createPaymentIntent);

/**
 * POST /payment/confirm
 * Confirms payment after client-side success
 * Requires: Authentication, paymentIntentId, bookingId
 */
router.post('/confirm', authenticate, confirmPayment);

/**
 * GET /payment/status/:paymentIntentId
 * Get the status of a payment intent
 */
router.get('/status/:paymentIntentId', getPaymentStatus);

/**
 * POST /payment/refund
 * Refund a payment for a booking
 * Requires: Authentication, bookingId
 */
router.post('/refund', authenticate, refundPayment);

/**
 * POST /payment/webhook
 * Handles Stripe webhook events for payment confirmation
 * Public route (no authentication needed)
 * Important: Must be registered before body parser middleware
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

module.exports = router;
