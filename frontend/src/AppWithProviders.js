import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './context/AuthContext';
import App from './App';

/**
 * AppWithProviders Component
 * Wraps the main App with all required providers
 * - AuthProvider: Global authentication state
 * - Stripe Elements: Payment processing
 * 
 * Usage: Replace <App /> with <AppWithProviders /> in index.js
 * Example: ReactDOM.render(<AppWithProviders />, document.getElementById('root'));
 */

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

const AppWithProviders = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </AuthProvider>
  );
};

export default AppWithProviders;
