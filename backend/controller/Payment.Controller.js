const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking.Model');

/**
 * Create Stripe Payment Intent
 * Called by frontend before card payment
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'usd' } = req.body;

    // Validate inputs
    if (!bookingId || !amount) {
      return res.status(400).json({ 
        message: 'Missing required fields: bookingId, amount' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be greater than 0' 
      });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to pay for this booking' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency,
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user.userId.toString(),
      },
      description: `Payment for booking #${bookingId}`,
    });

    res.status(201).json({
      message: 'Payment intent created successfully',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('[Payment] Error creating payment intent:', error);
    res.status(500).json({ 
      message: 'Payment processing failed', 
      error: error.message 
    });
  }
};

/**
 * Handle Stripe Webhook Events
 * Confirms payment success/failure
 */
const handleWebhook = async (req, res) => {
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
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
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

      console.log(`[Webhook] ✅ Payment successful for booking: ${bookingId}`);
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

      console.log(`[Webhook] ❌ Payment failed for booking: ${bookingId}`);
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

      console.log(`[Webhook] ⛔ Payment cancelled for booking: ${bookingId}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

module.exports = { createPaymentIntent, handleWebhook };
