import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import apiClient from '../../config/api';
import { toast } from 'react-toastify';

/**
 * PaymentForm Component
 * Handles credit/debit card payments via Stripe
 * 
 * Props:
 * - bookingId: ID of booking to pay for
 * - amount: Amount to charge (in dollars)
 * - onSuccess: Callback when payment succeeds
 * - onError: Callback when payment fails
 */
const PaymentForm = ({ bookingId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!stripe || !elements) {
      setError('Stripe library not loaded');
      return;
    }

    if (!bookingId || !amount) {
      setError('Missing booking ID or amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[Payment] Creating payment intent for booking:', bookingId);

      // Step 1: Create payment intent on backend
      const { data } = await apiClient.post('/payment/create-payment-intent', {
        bookingId,
        amount,
        currency: 'usd',
      });

      const { clientSecret } = data;

      console.log('[Payment] Payment intent created:', data.paymentIntentId);

      // Step 2: Confirm card payment with Stripe
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // Optional: add billing details if needed
            },
          },
        }
      );

      if (paymentError) {
        console.error('[Payment] Payment error:', paymentError);
        setError(paymentError.message);
        if (onError) onError(paymentError);
        toast.error(`Payment failed: ${paymentError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('[Payment] ✅ Payment successful:', paymentIntent.id);
        toast.success('Payment successful! Your booking is confirmed.');
        if (onSuccess) onSuccess(paymentIntent.id);
      } else if (paymentIntent.status === 'processing') {
        console.log('[Payment] Processing payment...');
        toast.info('Payment is being processed. Please wait...');
      }
    } catch (err) {
      console.error('[Payment] Error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
      if (onError) onError(err);
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {/* Card input */}
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Amount display */}
      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600">Amount to pay:</p>
        <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</p>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          loading || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">⏳</span>
            Processing Payment...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      {/* Test card info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <p className="font-medium mb-1">💳 Test with Stripe Demo Cards:</p>
        <p>Success: 4242 4242 4242 4242 (Any future date)</p>
        <p>Failed: 4000 0000 0000 0002</p>
      </div>
    </form>
  );
};

export default PaymentForm;
