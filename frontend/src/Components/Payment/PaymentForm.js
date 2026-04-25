import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import usePayment from '../../hooks/usePayment';

/**
 * PaymentForm Component
 * Handles credit/debit card payments via Stripe
 * 
 * Props:
 * - bookingId: ID of booking to pay for
 * - amount: Amount to charge (in dollars)
 * - onSuccess: Callback when payment succeeds
 * - onError: Callback when payment fails
 * - isLoading: External loading state
 */
const PaymentForm = ({ bookingId, amount, onSuccess, onError, isLoading: externalLoading = false }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, confirmPayment, isLoading: paymentLoading } = usePayment();
  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Create payment intent when component mounts
  useEffect(() => {
    if (!bookingId || !amount) {
      setError('Booking ID and amount are required');
      return;
    }

    const initializePayment = async () => {
      const result = await createPaymentIntent(bookingId, amount);
      if (result.success) {
        setClientSecret(result.data.clientSecret);
        setPaymentIntentId(result.data.paymentIntentId);
        setError(null);
      } else {
        setError(result.error);
        onError?.(result.error);
      }
    };

    initializePayment();
  }, [bookingId, amount, createPaymentIntent, onError]);

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError('');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded');
      return;
    }

    if (!clientSecret) {
      setError('Payment initialization failed. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('[Payment] Confirming card payment for booking:', bookingId);

      // Confirm card payment with Stripe
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (paymentError) {
        console.error('[Payment] Payment error:', paymentError.message);
        setError(paymentError.message);
        onError?.(paymentError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded - confirm with backend
        console.log('[Payment] Card payment succeeded:', paymentIntent.id);
        const confirmResult = await confirmPayment(paymentIntent.id, bookingId);

        if (confirmResult.success) {
          setSuccess(true);
          setError('');
          console.log('[Payment] Transaction confirmed by backend');
          onSuccess?.(confirmResult.data);
        } else {
          setError(confirmResult.error);
          onError?.(confirmResult.error);
        }
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error('[Payment] Error:', err);
      const errorMsg = err.message || 'Payment failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-success-container">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h3>Payment Successful!</h3>
          <p>Your booking has been confirmed. Check your email for confirmation details.</p>
        </div>
      </div>
    );
  }

  const isDisabled = !stripe || !cardComplete || loading || externalLoading || paymentLoading;

  return (
    <form onSubmit={handlePayment} className="payment-form-container">
      <div className="form-section">
        <label className="form-label">Card Details</label>
        <div className="card-element-wrapper">
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
            onChange={handleCardChange}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="amount-display">
        <span>Amount to pay:</span>
        <strong>${amount?.toFixed(2) || '0.00'}</strong>
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="pay-button"
      >
        {loading || externalLoading || paymentLoading ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          `Pay $${amount?.toFixed(2) || '0.00'}`
        )}
      </button>

      <div className="security-notice">
        <p>Your payment is secure and encrypted by Stripe.</p>
      </div>

      {/* Test card information */}
      <div className="test-cards-info">
        <p className="test-label">Test Cards (Stripe):</p>
        <p>Success: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits</p>
        <p>Failed: 4000 0000 0000 0002 | Exp: Any future date | CVC: Any 3 digits</p>
      </div>
    </form>
  );
};

export default PaymentForm;
