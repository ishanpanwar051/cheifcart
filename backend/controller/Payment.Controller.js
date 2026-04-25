const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking.Model');
const User = require('../models/User.Model');

/**
 * Create Stripe Payment Intent
 * Called by frontend before card payment
 * POST /payment/create-intent
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'usd' } = req.body;
    const userId = req.user?.userId;

    // Validate inputs
    if (!bookingId || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: bookingId, amount' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount must be greater than 0' 
      });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.user._id.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized to pay for this booking' 
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency,
      metadata: {
        bookingId: bookingId.toString(),
        userId: userId.toString(),
      },
      description: `Payment for booking #${bookingId}`,
    });

    // Update booking with payment intent
    booking.paymentIntentId = paymentIntent.id;
    booking.amount = amount;
    booking.paymentStatus = 'pending';
    await booking.save();

    console.log(`[Payment] Intent created: ${paymentIntent.id} for booking: ${bookingId}`);

    res.status(201).json({
      success: true,
      message: 'Payment intent created successfully',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('[Payment] Error creating payment intent:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment processing failed', 
      error: error.message 
    });
  }
};

/**
 * Confirm Payment After Client-Side Success
 * POST /payment/confirm
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    const userId = req.user?.userId;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID and Booking ID are required'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${paymentIntent.status}`
      });
    }

    // Update booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    await booking.save();

    console.log(`[Payment] Confirmed for booking: ${bookingId}`);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('[Payment] Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

/**
 * Handle Stripe Webhook Events
 * Confirms payment success/failure from Stripe
 * POST /payment/webhook
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).json({ 
      success: false,
      message: `Webhook error: ${err.message}` 
    });
  }

  try {
    // Handle successful payment
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { bookingId } = paymentIntent.metadata;

      await Booking.findByIdAndUpdate(
        bookingId,
        { 
          status: 'confirmed', 
          paymentStatus: 'completed',
          paymentIntentId: paymentIntent.id,
        },
        { new: true }
      );

      console.log(`[Webhook] Payment succeeded for booking: ${bookingId}`);
    }

    // Handle failed payment
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const { bookingId } = paymentIntent.metadata;

      await Booking.findByIdAndUpdate(
        bookingId,
        { 
          status: 'pending', 
          paymentStatus: 'failed',
          paymentIntentId: paymentIntent.id,
        },
        { new: true }
      );

      console.log(`[Webhook] Payment failed for booking: ${bookingId}`);
    }

    // Handle cancelled payment
    if (event.type === 'payment_intent.canceled') {
      const paymentIntent = event.data.object;
      const { bookingId } = paymentIntent.metadata;

      await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'cancelled', paymentStatus: 'cancelled' },
        { new: true }
      );

      console.log(`[Webhook] Payment cancelled for booking: ${bookingId}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).json({ 
      success: false,
      message: 'Webhook processing failed' 
    });
  }
};

/**
 * Get Payment Status
 * GET /payment/status/:paymentIntentId
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('[Payment] Error getting status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment status',
      error: error.message
    });
  }
};

/**
 * Refund Payment
 * POST /payment/refund
 */
exports.refundPayment = async (req, res) => {
  try {
    const { bookingId, reason = 'requested_by_customer' } = req.body;
    const userId = req.user?.userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (!booking.paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this booking'
      });
    }

    // Retrieve the payment intent and refund
    const paymentIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
    
    if (paymentIntent.charges.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No charge found to refund'
      });
    }

    const chargeId = paymentIntent.charges.data[0].id;
    const refund = await stripe.refunds.create({
      charge: chargeId,
      reason
    });

    booking.paymentStatus = 'cancelled';
    booking.status = 'cancelled';
    await booking.save();

    console.log(`[Payment] Refund created: ${refund.id}`);

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refundId: refund.id
    });
  } catch (error) {
    console.error('[Payment] Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
};
