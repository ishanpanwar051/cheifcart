import { useState, useCallback } from 'react';
import apiClient from '../config/api';

/**
 * usePayment Hook
 * Handles Stripe payment operations
 * Usage: const { createPaymentIntent, confirmPayment, isLoading } = usePayment();
 */
export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create Payment Intent
   * Returns clientSecret for Stripe Elements
   */
  const createPaymentIntent = useCallback(async (bookingId, amount, currency = 'usd') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post('/payment/create-intent', {
        bookingId,
        amount,
        currency,
      });

      console.log('[Payment] Intent created:', response.data.paymentIntentId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create payment intent';
      setError(errorMsg);
      console.error('[Payment] Create intent error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Confirm Payment
   * Called after Stripe confirms payment
   */
  const confirmPayment = useCallback(async (paymentIntentId, bookingId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post('/payment/confirm', {
        paymentIntentId,
        bookingId,
      });

      console.log('[Payment] Confirmed:', response.data.booking._id);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to confirm payment';
      setError(errorMsg);
      console.error('[Payment] Confirm error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get Payment Status
   * Check the status of a payment
   */
  const getPaymentStatus = useCallback(async (paymentIntentId) => {
    try {
      setError(null);

      const response = await apiClient.get(`/payment/status/${paymentIntentId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to get payment status';
      setError(errorMsg);
      console.error('[Payment] Get status error:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  /**
   * Refund Payment
   * Refund a completed payment
   */
  const refundPayment = useCallback(async (bookingId, reason = 'requested_by_customer') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post('/payment/refund', {
        bookingId,
        reason,
      });

      console.log('[Payment] Refund created:', response.data.refundId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to refund payment';
      setError(errorMsg);
      console.error('[Payment] Refund error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createPaymentIntent,
    confirmPayment,
    getPaymentStatus,
    refundPayment,
  };
};

export default usePayment;
