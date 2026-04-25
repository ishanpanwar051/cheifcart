# Implementation Checklist - All 4 Issues

Use this checklist to track your progress implementing all fixes.

---

## 🎯 ISSUE 1: PAYMENT GATEWAY (Stripe)

### Backend Setup
- [ ] Run: `cd backend && npm install stripe`
- [ ] Copy Stripe keys from https://dashboard.stripe.com/developers/api
- [ ] Add to `backend/.env`:
  - [ ] `STRIPE_SECRET_KEY=sk_test_...`
  - [ ] `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Verify files exist:
  - [ ] `backend/controller/Payment.Controller.js` ✅ (Created)
  - [ ] `backend/routes/Payment.route.js` ✅ (Created)
- [ ] Verify modified files:
  - [ ] `backend/models/Booking.Model.js` has `paymentStatus`, `paymentIntentId`, `amount` fields
  - [ ] `backend/app.js` has `app.use('/payment', require('./routes/Payment.route'))`
  - [ ] `backend/app.js` has `app.use('/uploads', express.static('uploads'))`

### Frontend Setup
- [ ] Run: `cd frontend && npm install @stripe/react-stripe-js @stripe/js`
- [ ] Add to `frontend/.env`:
  - [ ] `REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...`
- [ ] Verify files exist:
  - [ ] `frontend/src/Components/Payment/PaymentForm.js` ✅ (Created)
- [ ] Update `frontend/src/App.js`:
  - [ ] Import `{ Elements }` from `@stripe/react-stripe-js`
  - [ ] Import `{ loadStripe }` from `@stripe/js`
  - [ ] Create `stripePromise`
  - [ ] Wrap app with `<Elements stripe={stripePromise}>`
- [ ] Verify `frontend/src/config/api.js`:
  - [ ] Has authorization header interceptor

### Testing Payment
- [ ] Test card provided: `4242 4242 4242 4242`
- [ ] Test expiry: Any future date (e.g., 12/25)
- [ ] Test CVC: Any 3 digits (e.g., 123)
- [ ] Open DevTools → Console
- [ ] Go to booking page
- [ ] Click "Pay Now" (or your payment button)
- [ ] Enter card details
- [ ] Check console for success message
- [ ] Check backend logs for webhook event
- [ ] Verify booking status changed to "confirmed"

### Troubleshooting
- [ ] Check STRIPE_SECRET_KEY is valid
- [ ] Check REACT_APP_STRIPE_PUBLIC_KEY is valid
- [ ] Check Elements wrapper is in place
- [ ] Verify Booking model has payment fields
- [ ] Check browser console for errors
- [ ] Check backend console for errors

**Status: _______ (COMPLETE / IN PROGRESS / NOT STARTED)**

---

## 🔐 ISSUE 2: AUTHENTICATION

### Backend Setup
- [ ] Verify modified files:
  - [ ] `backend/middleware/AuthMiddleware.js` has `authenticate` function
  - [ ] `authenticate` function checks Bearer token format
  - [ ] `authenticate` function verifies JWT signature
- [ ] Verify `backend/.env` has:
  - [ ] `JWT_SECRET=your_secret_key`
- [ ] Test backend auth route:
  - [ ] Use Postman or curl to test `/auth/login`
  - [ ] Verify token is returned
  - [ ] Verify token can be used in Authorization header

### Frontend Setup
- [ ] Verify files exist:
  - [ ] `frontend/src/context/AuthContext.js` ✅ (Created)
  - [ ] `frontend/src/hooks/useAuth.js` ✅ (Created)
- [ ] Update `frontend/src/App.js` (or `index.js`):
  - [ ] Import `{ AuthProvider }` from `./context/AuthContext`
  - [ ] Wrap entire app with `<AuthProvider>`
- [ ] Update `frontend/src/Components/Auth/Signup.js`:
  - [ ] Import `{ useAuth }` from `../hooks/useAuth`
  - [ ] Get `login` function from `useAuth()`
  - [ ] Call `login(res.data.token, res.data.user)` on signup success
- [ ] Update `frontend/src/Components/Auth/Login.js`:
  - [ ] Import `{ useAuth }` from `../hooks/useAuth`
  - [ ] Get `login` function from `useAuth()`
  - [ ] Call `login(res.data.token, res.data.user)` on login success
- [ ] Create `frontend/src/routes/ProtectedRoute.js`:
  - [ ] Check if user is authenticated
  - [ ] Check if user has required role
  - [ ] Redirect to login if not authenticated
- [ ] Update `frontend/src/App.js` routes:
  - [ ] Use `<ProtectedRoute>` for admin/protected pages
  - [ ] Import `ProtectedRoute` component

### Testing Auth
- [ ] Sign up with new email:
  - [ ] Check localStorage has `token` and `user`
  - [ ] Check user is redirected to home page
- [ ] Refresh page:
  - [ ] Should stay logged in (token persists)
  - [ ] Should not redirect to login
- [ ] Try accessing admin page without login:
  - [ ] Should redirect to login page
- [ ] Login with correct credentials:
  - [ ] Should see welcome message
  - [ ] Should have access to admin page (if admin)
- [ ] Logout:
  - [ ] Should clear localStorage
  - [ ] Should redirect to login
  - [ ] Should not be able to access protected pages

### Troubleshooting
- [ ] Check AuthProvider wraps entire app
- [ ] Check localStorage has both `token` and `user`
- [ ] Check useAuth hook is imported correctly
- [ ] Check token format is `Bearer <token>`
- [ ] Check console for errors
- [ ] Verify JWT_SECRET matches frontend/backend

**Status: _______ (COMPLETE / IN PROGRESS / NOT STARTED)**

---

## 🖼️ ISSUE 3: IMAGES

### Preparation
- [ ] Verify utility file exists:
  - [ ] `frontend/src/utils/imageUtils.js` ✅ (Already exists)
- [ ] Review utility functions:
  - [ ] `getImageUrl()` - converts any image object to valid URL
  - [ ] `handleImageError()` - shows fallback on error
  - [ ] `getAvatarUrl()` - same for avatars
  - [ ] `handleAvatarError()` - fallback for avatars

### Finding Image Components
- [ ] List all components with images:
  - [ ] `ChefDetailsPage.js`
  - [ ] `Gallery.js` components
  - [ ] `Chef.js` components
  - [ ] `FounderCard.js`
  - [ ] Homepage components
  - [ ] Other image-heavy components
- [ ] Count total: _____ image components

### Update Each Component
For each component with images:
- [ ] Import: `import { getImageUrl, handleImageError } from '../utils/imageUtils';`
- [ ] For each `<img>` tag:
  - [ ] Replace `src={image}` with `src={getImageUrl(image)}`
  - [ ] Add `onError={handleImageError}`
  - [ ] Make sure `alt` text is meaningful

### Example Update
```javascript
// Before:
<img src={chef.profilepic} alt="chef" />

// After:
<img 
  src={getImageUrl(chef)}
  alt={chef.name}
  onError={handleImageError}
/>
```

### Backend Setup
- [ ] Verify `backend/app.js` has:
  - [ ] `app.use('/uploads', express.static('uploads'))`
- [ ] Create upload directories:
  - [ ] `backend/uploads/chefs/`
  - [ ] `backend/uploads/food/`
  - [ ] `backend/uploads/gallery/`
- [ ] Verify `backend/routes/upload.route.js` exists
- [ ] Test upload endpoint with Postman:
  - [ ] POST `/upload/image`
  - [ ] Include file in form-data
  - [ ] Should return imageUrl

### Testing Images
- [ ] Open DevTools → Network tab
- [ ] Refresh page
- [ ] Look for image requests:
  - [ ] All should show 200 status (success)
  - [ ] No 404 (not found) errors
  - [ ] No CORS errors
- [ ] Check visually:
  - [ ] All images display correctly
  - [ ] No broken image icons
- [ ] Test error fallback:
  - [ ] Block image URL in DevTools
  - [ ] Should show fallback image (not error)
- [ ] Test on mobile:
  - [ ] Images should load on smaller screens
  - [ ] Should be responsive

### Components Updated
- [ ] `ChefDetailsPage.js` ✓
- [ ] `____________________` ✓
- [ ] `____________________` ✓
- [ ] `____________________` ✓
- [ ] `____________________` ✓
- [ ] (List components as you update them)

### Troubleshooting
- [ ] Images still showing error? 
  - [ ] Check URL is correct (F12 → Network)
  - [ ] Check `/uploads` route exists in app.js
  - [ ] Check image file exists in server
- [ ] CORS error?
  - [ ] Image from same domain as app? (Should be)
  - [ ] Check app.js CORS settings
- [ ] Fallback not showing?
  - [ ] Check `onError={handleImageError}` is present
  - [ ] Check fallback image URL is valid

**Status: _______ (COMPLETE / IN PROGRESS / NOT STARTED)**

---

## 📍 ISSUE 4: LOCATION

### Frontend Setup
- [ ] Verify files exist:
  - [ ] `frontend/src/hooks/useLocation.js` ✅ (Created)
  - [ ] `frontend/src/Components/Location/LocationTracker.js` ✅ (Created)

### Add Location to Component
- [ ] Find main booking/chef search component
- [ ] Import location component:
  - [ ] `import LocationTracker from './Location/LocationTracker';`
- [ ] Add to JSX:
  ```javascript
  <LocationTracker onLocationChange={(loc) => {
    // Handle location update
    console.log('New location:', loc);
  }} />
  ```

### Testing Location
- [ ] Open app in browser
- [ ] Browser asks for location permission:
  - [ ] [ ] Allow
- [ ] Check if location appears:
  - [ ] Should show latitude/longitude
  - [ ] Should show accuracy (±X meters)
  - [ ] Should show timestamp
- [ ] Check console:
  - [ ] Should see location updates
  - [ ] Should NOT see permission errors
- [ ] Test denying permission:
  - [ ] Browser should ask again next time
  - [ ] Component should show error message
- [ ] Test on mobile:
  - [ ] More accurate than desktop
  - [ ] Should work on HTTPS only

### Optional: Backend Location Search
- [ ] Create `backend/routes/Location.route.js` (if needed)
- [ ] Implement `/location/nearby-chefs` endpoint
- [ ] Add geospatial indexes to Chef model:
  - [ ] `chefSchema.index({ location: '2dsphere' })`
- [ ] Test finding chefs near coordinates:
  - [ ] Use Postman with lat/lon params
  - [ ] Should return chefs within radius

### Troubleshooting
- [ ] Permission denied error?
  - [ ] Click lock icon in address bar
  - [ ] Enable location access
  - [ ] Reload page
- [ ] Location not updating?
  - [ ] Check browser console
  - [ ] Check permission is allowed
  - [ ] Make sure geolocation API works:
    ```javascript
    // In console:
    navigator.geolocation.getCurrentPosition(
      pos => console.log(pos),
      err => console.error(err)
    )
    ```
- [ ] HTTPS required in production?
  - [ ] Geolocation only works over HTTPS (except localhost)
  - [ ] Set up SSL certificate on production

**Status: _______ (COMPLETE / IN PROGRESS / NOT STARTED)**

---

## ✅ FINAL VERIFICATION

### All Issues Complete
- [ ] Issue 1 (Payment) - DONE
- [ ] Issue 2 (Auth) - DONE
- [ ] Issue 3 (Images) - DONE
- [ ] Issue 4 (Location) - DONE

### Code Quality
- [ ] No console.log() debugging statements
- [ ] No hardcoded API URLs
- [ ] .env file exists and is in .gitignore
- [ ] No secrets committed to git
- [ ] Code is formatted and readable

### Testing Complete
- [ ] Payment works end-to-end
- [ ] Auth persists across refreshes
- [ ] All images load with fallbacks
- [ ] Location works (with permission)
- [ ] No errors in console
- [ ] No errors in backend logs

### Deployment Ready
- [ ] Environment variables set
- [ ] Database connected
- [ ] Static files serving
- [ ] CORS configured
- [ ] Error handling in place
- [ ] Logging enabled

### Security Check
- [ ] No plaintext passwords
- [ ] Tokens verified on backend
- [ ] User input validated
- [ ] HTTPS enabled (if deployed)
- [ ] Secrets in .env not committed
- [ ] Database backups configured

---

## 📊 Progress Summary

| Issue | Status | Progress |
|-------|--------|----------|
| 1. Payment | ☐ TODO / ☑️ DONE | ___% |
| 2. Auth | ☐ TODO / ☑️ DONE | ___% |
| 3. Images | ☐ TODO / ☑️ DONE | ___% |
| 4. Location | ☐ TODO / ☑️ DONE | ___% |

**Overall Progress: ___% (0-100%)**

---

## 📝 Notes & Comments

Use this section to track issues or notes:

```
[Your notes here...]


```

---

## 🎉 Completion Checklist

- [ ] All 4 issues implemented
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Team informed of changes
- [ ] Ready for production deployment
- [ ] Monitoring set up
- [ ] Backup verified

---

**Estimated Time to Complete All:** 2-3 hours ⏱️

**Start Date:** _______________  
**Completion Date:** _______________

---

**Remember:** Go through issues in order (1 → 2 → 3 → 4) for best results!
