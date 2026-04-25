# Complete Implementation Guide

This document covers all the fixes implemented for the 4 critical issues in the ChiefCart food delivery app.

## Issues Fixed

1. **Payment Gateway Integration** - Stripe payment processing
2. **Authentication** - JWT-based login/signup with context
3. **Image Handling** - File upload and static serving
4. **Location Tracking** - Geolocation API integration

---

## Backend Setup

### 1. Environment Variables

Create a `.env` file in the backend directory:

```
# Database
MONGODB_URL=mongodb://localhost:27017/cheifcart

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key_here

# Stripe Keys (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Server
NODE_ENV=development
PORT=5000
```

### 2. Payment Integration

**File: `backend/controller/Payment.Controller.js`**

Key Functions:
- `createPaymentIntent()` - Creates Stripe PaymentIntent
- `confirmPayment()` - Confirms payment after card processing
- `handleWebhook()` - Processes Stripe webhook events
- `getPaymentStatus()` - Retrieves payment status
- `refundPayment()` - Processes refunds

**File: `backend/routes/Payment.route.js`**

Routes:
- `POST /payment/create-intent` - Create payment intent
- `POST /payment/confirm` - Confirm payment
- `POST /payment/webhook` - Stripe webhook (public)
- `GET /payment/status/:paymentIntentId` - Get status
- `POST /payment/refund` - Process refund

### 3. Database Models Updated

**File: `backend/models/Booking.Model.js`**

Added fields:
- `paymentStatus`: pending, completed, failed, cancelled
- `paymentIntentId`: Stripe PaymentIntent ID
- `amount`: Booking amount
- `numberOfGuests`: Number of guests
- `specialRequests`: Special requests text
- `paidAt`: Payment timestamp

### 4. Authentication Middleware

**File: `backend/middleware/AuthMiddleware.js`**

Updated with:
- `authenticate()` - Verifies JWT token
- `isAdmin()` - Checks admin role
- Better error handling and logging

### 5. API Routes

**File: `backend/app.js`**

Added:
```javascript
app.use('/payment', require('./routes/Payment.route'));
app.use('/uploads', express.static('uploads'));
```

---

## Frontend Setup

### 1. Environment Variables

Create `.env` file in frontend directory:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_ENVIRONMENT=development
```

### 2. Update index.js

Replace the App import with AppWithProviders:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import AppWithProviders from './AppWithProviders';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>,
  document.getElementById('root')
);
```

### 3. Authentication Context

**File: `frontend/src/context/AuthContext.js`**

Provides:
- `user` - Current user object
- `token` - JWT token
- `isAuthenticated` - Boolean flag
- `isAdmin` - Admin role check
- `signup(email, password, name, role)` - Sign up user
- `login(email, password)` - Login user
- `logout()` - Logout user
- `updateProfile(updates)` - Update user profile
- `changePassword(oldPassword, newPassword)` - Change password

### 4. Authentication Hook

**File: `frontend/src/hooks/useAuth.js`**

Usage:
```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user.name}</div>;
}
```

### 5. Payment Hook

**File: `frontend/src/hooks/usePayment.js`**

Functions:
- `createPaymentIntent(bookingId, amount, currency)` - Create intent
- `confirmPayment(paymentIntentId, bookingId)` - Confirm payment
- `getPaymentStatus(paymentIntentId)` - Get payment status
- `refundPayment(bookingId, reason)` - Request refund

Usage:
```javascript
import usePayment from '../hooks/usePayment';

function CheckoutPage() {
  const { createPaymentIntent, isLoading } = usePayment();
  
  const handleCheckout = async () => {
    const result = await createPaymentIntent(bookingId, 99.99);
    if (result.success) {
      // Show payment form
    }
  };
  
  return <button onClick={handleCheckout}>Checkout</button>;
}
```

### 6. Location Hook

**File: `frontend/src/hooks/useLocation.js`**

Functions:
- `getLocation()` - Get current location once
- `startWatching()` - Start continuous tracking
- `stopWatching()` - Stop tracking
- `calculateDistance(lat1, lon1, lat2, lon2)` - Calculate distance

Usage:
```javascript
import useLocation from '../hooks/useLocation';

function LocationPage() {
  const { location, getLocation, error, isWatching } = useLocation();
  
  return (
    <div>
      <button onClick={getLocation}>Get My Location</button>
      {location && (
        <div>
          Lat: {location.latitude}
          Lng: {location.longitude}
        </div>
      )}
    </div>
  );
}
```

### 7. Payment Form Component

**File: `frontend/src/Components/Payment/PaymentForm.js`**

Props:
- `bookingId` (required) - Booking ID
- `amount` (required) - Payment amount in dollars
- `onSuccess` - Callback on success
- `onError` - Callback on error
- `isLoading` - External loading state

Usage:
```javascript
import PaymentForm from '../Components/Payment/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
  return (
    <Elements stripe={stripe}>
      <PaymentForm 
        bookingId="booking123"
        amount={99.99}
        onSuccess={(data) => console.log('Success!', data)}
        onError={(error) => console.error('Error!', error)}
      />
    </Elements>
  );
}
```

### 8. Location Tracker Component

**File: `frontend/src/Components/Location/LocationTracker.js`**

Props:
- `autoWatch` - Auto-start tracking
- `onLocationChange` - Callback on location update
- `showMap` - Show map view
- `height` - Map height

Usage:
```javascript
import LocationTracker from '../Components/Location/LocationTracker';

function DeliveryPage() {
  const handleLocationChange = (location) => {
    console.log('User location:', location);
  };
  
  return (
    <LocationTracker 
      autoWatch={true}
      onLocationChange={handleLocationChange}
      showMap={true}
    />
  );
}
```

---

## Testing

### Backend Testing

1. **Payment Endpoint**
```bash
curl -X POST http://localhost:5000/payment/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking123",
    "amount": 99.99,
    "currency": "usd"
  }'
```

2. **Test Cards**
   - Success: `4242 4242 4242 4242`
   - Failed: `4000 0000 0000 0002`
   - Any future expiry date
   - Any 3-digit CVC

### Frontend Testing

1. **Authentication Flow**
   - Sign up with new user
   - Verify token stored in localStorage
   - Login with existing user
   - Verify user context updates
   - Logout and verify token cleared

2. **Payment Flow**
   - Create booking
   - Navigate to payment
   - Enter test card
   - Complete payment
   - Verify webhook received
   - Check booking status updated

3. **Location Flow**
   - Click "Get Location"
   - Grant browser permission
   - Verify coordinates displayed
   - Start tracking
   - Move device
   - Verify updates

---

## File Structure

```
backend/
├── controller/
│   ├── Payment.Controller.js (NEW - Enhanced)
│   └── ...existing files
├── routes/
│   ├── Payment.route.js (NEW - Enhanced)
│   └── ...existing files
├── models/
│   ├── Booking.Model.js (UPDATED - Payment fields)
│   └── ...existing files
├── middleware/
│   ├── AuthMiddleware.js (UPDATED - Enhanced)
│   └── ...existing files
├── app.js (UPDATED - Payment routes)
└── .env.example (NEW)

frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js (UPDATED - Enhanced)
│   ├── hooks/
│   │   ├── useAuth.js (UPDATED)
│   │   ├── usePayment.js (NEW)
│   │   └── useLocation.js (UPDATED - Enhanced)
│   ├── Components/
│   │   ├── Payment/
│   │   │   ├── PaymentForm.js (UPDATED - Enhanced)
│   │   │   └── PaymentForm.css (NEW)
│   │   ├── Location/
│   │   │   ├── LocationTracker.js (UPDATED - Enhanced)
│   │   │   └── LocationTracker.css (NEW)
│   │   └── ...existing files
│   ├── AppWithProviders.js (NEW)
│   └── ...existing files
├── .env.example (NEW)
└── package.json (UPDATED - New dependencies)
```

---

## Dependencies Added

**Backend:**
- `stripe` - ^14.0.0
- `dotenv` - Already present
- `multer` - ^1.4.5
- `cors` - Already present
- `helmet` - Already present
- `express-validator` - Already present

**Frontend:**
- `@stripe/stripe-js` - ^1.46.0
- `@stripe/react-stripe-js` - ^1.16.0
- `axios` - Already present

---

## Troubleshooting

### Payment Issues

**Problem**: "Payment intent creation failed"
- Check `STRIPE_SECRET_KEY` is correct
- Verify booking ID exists
- Check amount is positive number

**Problem**: "Webhook signature verification failed"
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure webhook is configured in Stripe dashboard
- Check webhook is using raw request body

### Authentication Issues

**Problem**: "Token verification failed"
- Check `JWT_SECRET` matches between login and requests
- Verify token is being sent in Authorization header
- Check token hasn't expired

**Problem**: "Login fails with 401"
- Verify user exists in database
- Check password matches hashed value
- Verify MongoDB connection

### Location Issues

**Problem**: "Permission denied"
- Enable location in browser settings
- Use HTTPS (required for geolocation)
- Check browser privacy settings

**Problem**: "Cannot get address"
- May be rate limited by geocoding service
- Try again later
- Fallback shows coordinates

---

## Next Steps

1. Get Stripe API keys from https://dashboard.stripe.com
2. Set up Stripe webhook for webhook events
3. Configure MongoDB connection
4. Update environment variables
5. Test all flows
6. Deploy to production

For questions or issues, refer to:
- Stripe Docs: https://stripe.com/docs
- React Docs: https://react.dev
- MongoDB Docs: https://docs.mongodb.com
