# Quick Fixes Reference - Food Delivery App

## 🎯 Problem → Solution Map

### ❌ Problem 1: Payment Not Working
**Why:** No Stripe integration  
**Quick Fix:** 
1. `npm install stripe` (backend) + `npm install @stripe/react-stripe-js @stripe/js` (frontend)
2. Add `.env`: `STRIPE_SECRET_KEY=sk_test_...` and `REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...`
3. Wrap app: `<Elements stripe={stripePromise}><App /></Elements>`
4. Use: `<PaymentForm bookingId="..." amount={99.99} />`

**Files Ready:** ✅ Payment.Controller.js, Payment.route.js, PaymentForm.js  
**Status:** Backend done, frontend needs wrapper + form usage

---

### ❌ Problem 2: Login/Signup Not Storing/Persisting
**Why:** No auth state management, tokens not persistent  
**Quick Fix:**
1. Wrap app: `<AuthProvider><App /></AuthProvider>`
2. Update login: Use `const { login } = useAuth()` then `login(token, user)`
3. Create protected routes: `<ProtectedRoute><AdminPage /></ProtectedRoute>`

**Files Ready:** ✅ AuthContext.js, useAuth.js, AuthMiddleware updated  
**Status:** Context ready, needs to be integrated into App.js and login components

---

### ❌ Problem 3: Images Show Text Instead of Images
**Why:** Broken image URLs, no static file serving  
**Quick Fix:**
1. Use utility: `<img src={getImageUrl(chef)} onError={handleImageError} />`
2. Backend already serves `/uploads` directory
3. Frontend already has image utilities

**Files Ready:** ✅ imageUtils.js, upload.route.js, app.js updated  
**Status:** Utilities ready, components need updating

---

### ❌ Problem 4: Live Location Not Working
**Why:** No geolocation implementation  
**Quick Fix:**
1. Import: `const { location, error, loading } = useLocation()`
2. Use component: `<LocationTracker onLocationChange={handleLocationChange} />`
3. Send coords to backend: `api.get('/location/nearby-chefs?lat=...&lon=...')`

**Files Ready:** ✅ useLocation.js, LocationTracker.js  
**Status:** Hooks ready, needs integration into components

---

## 🚀 Quick Start Order

1. **Issue 1 - Payment (30 min)**
   - Install packages
   - Set env vars (Stripe keys from dashboard.stripe.com)
   - Wrap app with Stripe Elements
   - Import and use PaymentForm component

2. **Issue 2 - Auth (20 min)**
   - Wrap app with AuthProvider
   - Update Login/Signup components to use useAuth hook
   - Create ProtectedRoute wrapper
   - Update routes in App.js

3. **Issue 3 - Images (15 min)**
   - Find all image components
   - Replace `src={image}` with `src={getImageUrl(image)}`
   - Add `onError={handleImageError}`

4. **Issue 4 - Location (15 min)**
   - Import LocationTracker in booking page
   - Pass onLocationChange callback
   - Optional: Create backend route for nearby chefs

**Total Time: ~80 minutes**

---

## 📝 Code Snippets (Copy-Paste Ready)

### Wrap App with Auth + Stripe
```javascript
// App.js
import { AuthProvider } from './context/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        {/* Your routes and components */}
      </Elements>
    </AuthProvider>
  );
}
```

### Update Login Component
```javascript
// Login.js
import { useAuth } from '../hooks/useAuth';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await apiClient.post('/auth/login', { email, password });
    const { login } = useAuth(); // ← Move this inside or above
    login(res.data.token, res.data.user);
  } catch (err) {
    // handle error
  }
};
```

### Use PaymentForm
```javascript
import PaymentForm from './Payment/PaymentForm';

<PaymentForm 
  bookingId={bookingId}
  amount={100}
  onSuccess={(paymentId) => navigate('/success')}
/>
```

### Fix Image Components
```javascript
import { getImageUrl, handleImageError } from '../utils/imageUtils';

// Before:
<img src={chef.profilepic} alt="chef" />

// After:
<img 
  src={getImageUrl(chef)}
  alt={chef.name}
  onError={handleImageError}
/>
```

### Add Location Tracking
```javascript
import LocationTracker from './Location/LocationTracker';
import useLocation from '../hooks/useLocation';

function BookingPage() {
  const handleLocationChange = (loc) => {
    // Send to backend or filter chefs
    findNearbyChefs(loc.latitude, loc.longitude);
  };

  return (
    <div>
      <LocationTracker onLocationChange={handleLocationChange} />
      {/* Rest of page */}
    </div>
  );
}
```

---

## 🔑 Environment Variables Needed

### Backend `.env`
```
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
JWT_SECRET=your_secret_here
MONGODB_URL=mongodb+srv://...
```

### Frontend `.env`
```
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxx
REACT_APP_API_URL=http://localhost:3000
```

**Get Stripe keys:** https://dashboard.stripe.com → Developers → API Keys

---

## ✅ Validation Checklist

After implementing each fix, verify:

**Payment:**
- [ ] No console errors on PaymentForm mount
- [ ] Can see card input field
- [ ] Test payment with card 4242 4242 4242 4242
- [ ] Backend receives webhook event
- [ ] Booking status changes to "confirmed"

**Auth:**
- [ ] Can signup and get token
- [ ] Token persists after refresh
- [ ] Can login and redirect to dashboard
- [ ] Logout clears token and redirects
- [ ] Protected routes work

**Images:**
- [ ] Images appear without broken icons
- [ ] Fallback image shows on error
- [ ] Network tab shows 200 status
- [ ] No CORS errors in console

**Location:**
- [ ] Browser asks for location permission
- [ ] Location updates in real-time
- [ ] Accuracy ±5-50m (depends on device)
- [ ] Error messages clear if permission granted

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Stripe error "pk_test is not a valid key" | Wrong env var | Check REACT_APP_STRIPE_PUBLIC_KEY in .env |
| 401 Unauthorized on protected route | No token or expired | Login first, check localStorage |
| Images show 404 | Wrong path or no static serving | Use getImageUrl() + verify /uploads route |
| Location permission dialog not shown | HTTPS required (except localhost) | Use HTTPS in production |
| PaymentForm not visible | Missing Stripe Elements wrapper | Wrap app with `<Elements stripe={...}>` |

---

## 📊 Status Overview

| Issue | Files | Backend | Frontend | Status |
|-------|-------|---------|----------|--------|
| 1. Payment | 5 | ✅ Done | 80% (needs wrapper) | Integration ready |
| 2. Auth | 3 | ✅ Done | 70% (needs context) | Context ready |
| 3. Images | 1 | ✅ Done | 50% (needs updates) | Utils ready |
| 4. Location | 2 | - | ✅ Done | Hooks ready |

---

## 📞 Need More Details?

- **Payment:** See FIXES_IMPLEMENTATION.md → Issue 1
- **Auth:** See FIXES_IMPLEMENTATION.md → Issue 2
- **Images:** See FIXES_IMPLEMENTATION.md → Issue 3
- **Location:** See FIXES_IMPLEMENTATION.md → Issue 4
- **Full Guide:** See DEBUGGING_GUIDE.md

---

**Start with Issue 1 (Payment) and work down. Each fix is independent and takes ~20 minutes.**
