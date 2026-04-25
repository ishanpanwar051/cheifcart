# Common Mistakes to Avoid - Food Delivery App

## 🚫 Payment Integration Mistakes

### ❌ Mistake 1: Using publishable key as secret
```javascript
// WRONG - DON'T DO THIS
const stripe = require('stripe')('pk_test_...');

// RIGHT
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### ❌ Mistake 2: Storing card details in database
```javascript
// WRONG - NEVER STORE CARD DATA
const booking = {
  cardNumber: '4242 4242 4242 4242', // ❌ ILLEGAL
  cvv: '123' // ❌ ILLEGAL
};

// RIGHT - Only store PaymentIntent ID
const booking = {
  paymentIntentId: 'pi_xxx', // ✅ SAFE
  paymentStatus: 'completed'
};
```

### ❌ Mistake 3: Not verifying payment on backend
```javascript
// WRONG - Frontend only payment
const handlePayment = async () => {
  // Assuming payment succeeded...
  updateBookingStatus('confirmed'); // ❌ NOT SAFE
};

// RIGHT - Always verify on backend
const handlePayment = async () => {
  const res = await apiClient.post('/verify-payment', { paymentIntentId });
  if (res.data.verified) {
    updateBookingStatus('confirmed'); // ✅ SAFE
  }
};
```

### ❌ Mistake 4: Using test keys in production
```javascript
// WRONG
const stripePromise = loadStripe('pk_test_xxx'); // Production site!

// RIGHT
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
// Then set REACT_APP_STRIPE_PUBLIC_KEY=pk_live_xxx in production
```

### ❌ Mistake 5: Ignoring webhook signature
```javascript
// WRONG - Anyone can send fake webhooks
app.post('/payment/webhook', (req, res) => {
  const event = JSON.parse(req.body); // ❌ Not verified
});

// RIGHT - Always verify signature
app.post('/payment/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, secret); // ✅ Verified
});
```

---

## 🚫 Authentication Mistakes

### ❌ Mistake 1: Storing password in plaintext
```javascript
// WRONG
const user = new User({
  password: 'mypassword123' // ❌ VULNERABLE
});

// RIGHT - Always hash with bcrypt
const hashedPassword = await bcrypt.hash(password, 12);
const user = new User({
  password: hashedPassword // ✅ SECURE
});
```

### ❌ Mistake 2: Not checking token before using it
```javascript
// WRONG - Token might be expired
const decoded = jwt.verify(token, secret); // Could throw!
req.user = decoded;

// RIGHT - Always wrap in try-catch
try {
  const decoded = jwt.verify(token, secret);
  req.user = decoded;
} catch (err) {
  return res.status(401).json({ message: 'Invalid token' });
}
```

### ❌ Mistake 3: Storing token in localStorage for sensitive apps
```javascript
// WRONG - XSS attack can steal token
localStorage.setItem('token', jwtToken);

// BETTER - Use httpOnly cookie (inaccessible to JS)
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

### ❌ Mistake 4: Not sending token in every request
```javascript
// WRONG - Token only sent sometimes
const res = await apiClient.post('/booking', data);

// RIGHT - Always send in Authorization header
const res = await apiClient.post('/booking', data, {
  headers: { Authorization: `Bearer ${token}` }
});
// Or use axios interceptor (already in your config/api.js)
```

### ❌ Mistake 5: Exposing sensitive data in JWT payload
```javascript
// WRONG - Password hash in JWT!
const token = jwt.sign({
  userId: user._id,
  password: user.password, // ❌ EXPOSED
  email: user.email
}, secret);

// RIGHT - Only store essential data
const token = jwt.sign({
  userId: user._id,
  role: user.role // ✅ NON-SENSITIVE
}, secret);
```

### ❌ Mistake 6: Not clearing token on logout
```javascript
// WRONG - Token still in storage
const logout = () => {
  setUser(null);
  // ❌ Token still there!
};

// RIGHT - Clear everything
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.common['Authorization'];
  setUser(null);
};
```

### ❌ Mistake 7: Hardcoding secret keys
```javascript
// WRONG
const JWT_SECRET = 'hardcoded_secret_key';

// RIGHT
const JWT_SECRET = process.env.JWT_SECRET;
// Set in .env: JWT_SECRET=a_very_long_random_string
```

---

## 🚫 Image Handling Mistakes

### ❌ Mistake 1: Not handling missing images
```javascript
// WRONG - Broken image, no fallback
<img src={chef.profilepic} alt="chef" />

// RIGHT - With fallback
import { getImageUrl, handleImageError } from '../utils/imageUtils';
<img 
  src={getImageUrl(chef)}
  alt={chef.name}
  onError={handleImageError}
/>
```

### ❌ Mistake 2: Using absolute paths for local images
```javascript
// WRONG - Path is server-dependent
<img src="C:\Users\Photos\chef.jpg" />

// RIGHT - Use relative or URL paths
<img src="/uploads/chef.jpg" />
// Or use image URL from server
<img src="https://api.example.com/uploads/chef.jpg" />
```

### ❌ Mistake 3: Not serving static files
```javascript
// WRONG - Frontend requests /uploads/image.jpg but server doesn't serve it
// User uploads image to /backend/uploads/image.jpg
<img src="/uploads/image.jpg" /> // 404!

// RIGHT - Enable static file serving in Express
app.use('/uploads', express.static('uploads'));
<img src="/uploads/image.jpg" /> // Works!
```

### ❌ Mistake 4: Storing files without organizing structure
```javascript
// WRONG - All files in one folder
backend/uploads/
  chef1.jpg
  chef2.jpg
  food1.jpg
  food2.jpg

// RIGHT - Organize by category
backend/uploads/
  chefs/
    chef1.jpg
    chef2.jpg
  food/
    food1.jpg
    food2.jpg
```

### ❌ Mistake 5: Not handling CORS for external images
```javascript
// WRONG - Cross-origin image fails silently
<img src="https://other-domain.com/image.jpg" crossOrigin="use-credentials" />

// RIGHT - Set correct CORS attribute
<img 
  src="https://other-domain.com/image.jpg" 
  crossOrigin="anonymous" // Most images don't need credentials
/>
```

### ❌ Mistake 6: Not validating file type on upload
```javascript
// WRONG - Accept any file
<input type="file" onChange={handleUpload} />

// RIGHT - Validate file type
const handleUpload = (file) => {
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    alert('Only JPG and PNG allowed');
    return;
  }
  uploadFile(file);
};
```

---

## 🚫 Location Mistakes

### ❌ Mistake 1: Using location without HTTPS in production
```javascript
// WRONG - Location doesn't work over HTTP in production
// localhost works, but yoursite.com must use HTTPS

// RIGHT - Always use HTTPS
https://yoursite.com // ✅ Geolocation works
http://yoursite.com  // ❌ Geolocation fails
```

### ❌ Mistake 2: Continuously watching location without cleanup
```javascript
// WRONG - Location watcher never stops (drains battery)
useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(...);
  // ❌ No cleanup!
}, []);

// RIGHT - Clean up on unmount
useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(...);
  return () => navigator.geolocation.clearWatch(watchId); // ✅ Cleanup
}, []);
```

### ❌ Mistake 3: Not requesting permission explicitly
```javascript
// WRONG - Assuming user grants permission
const { location } = useLocation(); // Might be error!

// RIGHT - Always check error state
const { location, error } = useLocation();
if (error) {
  return <div>Please enable location to continue</div>;
}
```

### ❌ Mistake 4: Storing location without consent
```javascript
// WRONG - Saving location to database without asking
const location = await getLocation();
await saveUserLocation(location); // ❌ Privacy violation

// RIGHT - Ask permission first
const { location } = useLocation(); // Browser asks user
if (location) {
  await saveUserLocation(location); // User consented
}
```

### ❌ Mistake 5: Not handling location timeout
```javascript
// WRONG - No timeout handling
const watchId = navigator.geolocation.watchPosition(
  success,
  error,
  { timeout: Infinity } // Will hang forever!
);

// RIGHT - Set reasonable timeout
const watchId = navigator.geolocation.watchPosition(
  success,
  error,
  { timeout: 5000 } // 5 second timeout
);
```

---

## 🚫 General Mistakes

### ❌ Mistake 1: Not using environment variables
```javascript
// WRONG
const API_URL = 'http://localhost:3000';
const STRIPE_KEY = 'pk_test_xxx';

// RIGHT
const API_URL = process.env.REACT_APP_API_URL;
const STRIPE_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
```

### ❌ Mistake 2: Committing .env files
```bash
# WRONG - Never commit secrets!
git add .env
git commit -m "Add env vars"
git push

# RIGHT - Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add gitignore"
```

### ❌ Mistake 3: Not validating input on backend
```javascript
// WRONG - Trust frontend validation
app.post('/payment', async (req, res) => {
  const { amount } = req.body;
  // Process payment // ❌ No validation!
});

// RIGHT - Always validate server-side
app.post('/payment', async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  
  // Process payment // ✅ Validated
});
```

### ❌ Mistake 4: Not logging errors
```javascript
// WRONG - Silent failures
try {
  await saveBooking(data);
} catch (err) {
  // No logging! How will you debug?
}

// RIGHT - Always log errors
try {
  await saveBooking(data);
} catch (err) {
  console.error('[Booking] Error saving booking:', err);
  res.status(500).json({ message: 'Failed to save booking' });
}
```

### ❌ Mistake 5: Not testing error scenarios
```javascript
// WRONG - Only test happy path
test('Should create booking', () => {
  const booking = createBooking(data);
  expect(booking).toBeDefined();
});

// RIGHT - Test error cases too
test('Should reject invalid amount', () => {
  expect(() => createBooking({ amount: -10 })).toThrow();
});

test('Should reject missing user', () => {
  expect(() => createBooking({ ...data, userId: null })).toThrow();
});
```

---

## ✅ Best Practices Summary

| Category | DO | DON'T |
|----------|----|----|
| **Passwords** | Hash with bcrypt(12) | Store plaintext |
| **Tokens** | Send in Authorization header | Send as URL param |
| **Secrets** | Store in .env | Hardcode or commit |
| **Validation** | Validate on backend | Trust frontend only |
| **Errors** | Log with context | Silent failures |
| **Cleanup** | Clear watchers/timers | Leave running |
| **Images** | Use fallbacks | Assume always load |
| **Location** | Ask permission first | Grab without consent |
| **Testing** | Test error cases | Only happy path |
| **CORS** | Restrict origin | Accept all |

---

## 🔍 Pre-Deployment Checklist

- [ ] No `console.log()` debugging statements left
- [ ] No hardcoded API URLs or keys
- [ ] `.env` file is in `.gitignore`
- [ ] All passwords are hashed
- [ ] All tokens verified on backend
- [ ] All user input validated
- [ ] All errors logged with context
- [ ] Images have fallbacks
- [ ] Location uses HTTPS
- [ ] CORS configured to your domain
- [ ] Rate limiting enabled
- [ ] Security headers set (helmet.js)
- [ ] Database indexes created
- [ ] Webhooks verified with signatures
- [ ] Error monitoring set up (Sentry)

---

**Remember:** "Never trust the frontend. Always validate on the backend."
