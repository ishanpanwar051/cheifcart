# Food Delivery App - Implementation Guide for Fixes

## Overview
This guide walks you through implementing the 4 fixes for critical issues in your app. Start with **Issue 1** (Payment) and work through in order.

---

## ✅ Issue 1: Payment Gateway Integration (Stripe)

### Files Created/Modified:
- ✅ `backend/controller/Payment.Controller.js` - NEW
- ✅ `backend/routes/Payment.route.js` - NEW
- ✅ `backend/models/Booking.Model.js` - UPDATED
- ✅ `backend/app.js` - UPDATED
- ✅ `frontend/src/Components/Payment/PaymentForm.js` - NEW

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install stripe
```

**Frontend:**
```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/js
```

### Step 2: Get Stripe API Keys

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up or log in
3. Go to **Developers** → **API Keys**
4. Copy:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### Step 3: Setup Webhooks (For Production)

1. In Stripe Dashboard: **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter: `https://yourdomain.com/payment/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the **Signing Secret** (starts with `whsec_`)

### Step 4: Set Environment Variables

**Backend `.env` file:**
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
JWT_SECRET=your_jwt_secret
MONGODB_URL=your_mongodb_connection_string
```

**Frontend `.env` file:**
```env
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_actual_public_key_here
REACT_APP_API_URL=http://localhost:3000
```

### Step 5: Verify Backend Implementation

The following files are ready:
- ✅ `Payment.Controller.js` - Handles payment intent creation and webhook processing
- ✅ `Payment.route.js` - Two routes: POST `/create-payment-intent` and POST `/webhook`
- ✅ `Booking.Model.js` - Updated with `paymentStatus` and `paymentIntentId` fields
- ✅ `app.js` - Routes added: `app.use('/payment', require('./routes/Payment.route'))`

### Step 6: Wrap Frontend App with Stripe Provider

**Update `frontend/src/App.js`:**
```javascript
import { loadStripe } from '@stripe/js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      {/* Your existing app routes and components */}
    </Elements>
  );
}

export default App;
```

### Step 7: Use Payment Form in Booking Component

In any component where you want to accept payments:
```javascript
import PaymentForm from '../Payment/PaymentForm';

export default function BookingConfirmation() {
  const handlePaymentSuccess = (paymentIntentId) => {
    console.log('Payment successful:', paymentIntentId);
    // Redirect to success page or update UI
  };

  return (
    <div>
      <h2>Complete Your Booking</h2>
      <PaymentForm 
        bookingId="booking_id_here"
        amount={99.99}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
```

### Testing Payment

**Test Card Numbers (Stripe):**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

**Test Expiry:** Any future date  
**Test CVC:** Any 3 digits

---

## ✅ Issue 2: Authentication/Login Issues

### Files Created/Modified:
- ✅ `frontend/src/context/AuthContext.js` - NEW
- ✅ `frontend/src/hooks/useAuth.js` - NEW
- ✅ `backend/middleware/AuthMiddleware.js` - UPDATED

### Step 1: Implement Auth Context

The `AuthContext.js` file is already created. Now wrap your app with it:

**Update `frontend/src/index.js` or `frontend/src/App.js`:**
```javascript
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app routes here */}
    </AuthProvider>
  );
}
```

### Step 2: Update Login/Signup Components

**Update `frontend/src/Components/Auth/Signup.js`:**
```javascript
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/api';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/signup', { name, email, password });
      
      // Use auth context instead of localStorage directly
      login(res.data.token, res.data.user);
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
};
```

**Update `frontend/src/Components/Auth/Login.js`:**
```javascript
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  // ... rest of state setup

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { email, password });
      
      // Use auth context
      login(res.data.token, res.data.user);
      
      toast.success('Login successful!');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
};
```

### Step 3: Create Protected Routes

**Create `frontend/src/routes/ProtectedRoute.js`:**
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
```

### Step 4: Use Protected Routes in App

**Update `frontend/src/App.js`:**
```javascript
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './Components/Admin/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Public routes */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
```

### Step 5: Access Auth Data in Components

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, token, logout, isAdmin } = useAuth();

  return (
    <div>
      {user && <p>Welcome, {user.name}!</p>}
      {isAdmin && <button>Admin Panel</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## ✅ Issue 3: Images Not Loading

### Files Already Have:
- ✅ `frontend/src/utils/imageUtils.js` - Utility functions for image handling
- ✅ `backend/routes/upload.route.js` - Cloudinary upload integration (already exists)

### Step 1: Use Image Utilities Consistently

Instead of directly using image URLs, use the utility functions:

**Bad (won't show fallback on error):**
```javascript
<img src={chef.profilepic} alt="chef" />
```

**Good (with fallback):**
```javascript
import { getImageUrl, handleImageError } from '../utils/imageUtils';

<img 
  src={getImageUrl(chef)}
  alt={chef.name}
  className="w-24 h-24 rounded-full object-cover"
  onError={handleImageError}
/>
```

### Step 2: Update Key Components

**Fix `frontend/src/Components/ChefDetailsPage.js`:**
```javascript
import { getImageUrl, handleImageError } from '../utils/imageUtils';

// In the JSX:
<img
  src={getImageUrl(chef)}
  alt={chef.name}
  className="w-24 h-24 rounded-full object-cover"
  onError={handleImageError}
/>
```

**Fix other image components similarly**

### Step 3: For Backend Static Files

The app.js already has:
```javascript
app.use('/uploads', express.static('uploads'));
```

This enables serving images from the `/uploads` directory.

### Step 4: Upload Images Properly

When uploading images, ensure they're stored with correct paths:

```javascript
import ImageUpload from './Components/common/ImageUpload';

// In a form component:
<ImageUpload 
  onImageUpload={(imageUrl) => {
    console.log('Image uploaded:', imageUrl);
    // Save imageUrl to database
  }}
/>
```

### Verification

1. Check browser **Network** tab to see if images load (200 status)
2. Check **Console** for CORS or file not found errors
3. Verify image URLs are absolute (http://...) or correct relative paths (/uploads/...)

---

## ✅ Issue 4: Live Location Not Working

### Files Created:
- ✅ `frontend/src/hooks/useLocation.js` - Geolocation hook
- ✅ `frontend/src/Components/Location/LocationTracker.js` - UI component

### Step 1: Add Location Hook to Component

```javascript
import useLocation from '../../hooks/useLocation';

function MyComponent() {
  const { location, error, loading } = useLocation();

  if (loading) return <p>Getting location...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!location) return null;

  return (
    <div>
      <p>Latitude: {location.latitude.toFixed(6)}</p>
      <p>Longitude: {location.longitude.toFixed(6)}</p>
      <p>Accuracy: ±{location.accuracy.toFixed(0)}m</p>
    </div>
  );
}
```

### Step 2: Use Location Tracker Component

```javascript
import LocationTracker from './Components/Location/LocationTracker';

function BookingPage() {
  const handleLocationChange = (location) => {
    console.log('User location:', location);
    // Send to backend or filter chefs by location
  };

  return (
    <div>
      <LocationTracker onLocationChange={handleLocationChange} />
    </div>
  );
}
```

### Step 3: Enable Location Permission

When user first visits the page, browser will ask for permission:
```
⚠️ This site wants to know your location
   [Allow] [Block]
```

**If blocked:**
- Chrome: Click lock icon → Site settings → Reset permissions
- Firefox: Menu → Preferences → Privacy → Permissions → Clear location access
- Safari: Preferences → Privacy → Location Services

### Step 4: Test Location Access

```javascript
// Quick test in browser console:
navigator.geolocation.getCurrentPosition(pos => {
  console.log('Location:', pos.coords.latitude, pos.coords.longitude);
});
```

### Step 5: For Nearby Chef Search (Backend)

The location hook provides real-time coordinates. To find nearby chefs:

```javascript
import apiClient from '../config/api';

async function findNearbyChefs(location, radius = 5) {
  try {
    const response = await apiClient.get('/location/nearby-chefs', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius, // in km
      }
    });
    return response.data.data;
  } catch (err) {
    console.error('Error finding chefs:', err);
  }
}
```

**Note:** Backend route `/location/nearby-chefs` requires MongoDB geospatial setup. Create the route if needed.

---

## 🔑 Environment Variables Checklist

### Backend `.env`
```env
# Database
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_secret_key_min_32_chars

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
# API
REACT_APP_API_URL=http://localhost:3000

# Payment (Stripe)
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxxx
```

---

## 🧪 Testing All Fixes

### Test Payment (Issue 1)
```bash
# 1. Start servers
# 2. Go to booking page
# 3. Click "Pay Now"
# 4. Use test card: 4242 4242 4242 4242
# 5. Check browser console and backend logs
```

### Test Auth (Issue 2)
```bash
# 1. Sign up with new email
# 2. Check localStorage has token and user
# 3. Refresh page - you should stay logged in
# 4. Click logout
# 5. Try accessing protected route - should redirect to login
```

### Test Images (Issue 3)
```bash
# 1. Inspect Network tab (F12)
# 2. Look for GET requests to images
# 3. Status should be 200, not 404
# 4. Check Console for CORS errors
```

### Test Location (Issue 4)
```bash
# 1. Allow location permission when prompted
# 2. Check console for location coordinates
# 3. Try blocking and unblocking permission
# 4. Test on mobile (more accurate)
```

---

## 🐛 Troubleshooting

### Payment Issues
- Missing Stripe keys? Check `.env` file
- Webhook failing? Verify `STRIPE_WEBHOOK_SECRET` is correct
- PaymentIntent error? Check booking exists and user authorized

### Auth Issues
- Token not persisting? Check AuthProvider wraps whole app
- 401 errors? Verify token format: `Bearer <token>`
- Logout not working? Check localStorage is cleared

### Image Issues
- Images show broken? Use `getImageUrl()` utility
- Path error? Verify `/uploads` route in app.js
- CORS error? Check image URL is same origin

### Location Issues
- Permission denied? Check browser location settings
- No coordinates? Requires HTTPS (except localhost)
- Accuracy low? Try enabling High Accuracy mode (drains battery)

---

## 📋 Final Checklist

Before deployment:

**Backend:**
- [ ] `.env` file has all required variables
- [ ] Stripe keys tested with test mode
- [ ] Webhook endpoint configured in Stripe
- [ ] Database connection tested
- [ ] All routes responding correctly (test with Postman)

**Frontend:**
- [ ] `.env` file has API URL and Stripe public key
- [ ] App wrapped with `AuthProvider`
- [ ] Stripe `Elements` provider wrapping routes
- [ ] All image components use `getImageUrl()`
- [ ] Protected routes configured
- [ ] No console errors on startup

**Deployment:**
- [ ] Use HTTPS everywhere
- [ ] Enable location only on HTTPS
- [ ] Update CORS origin in app.js
- [ ] Use production Stripe keys
- [ ] Test payment flow end-to-end
- [ ] Monitor error logs

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Need help?** Check the specific issue's debugging section in this file or review the console logs.
