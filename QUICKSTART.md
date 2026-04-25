# Quick Start Guide

Get the ChiefCart app up and running in 10 minutes.

## Backend Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add:
- `MONGODB_URL` - Your MongoDB connection string
- `JWT_SECRET` - Any random string (e.g., "my_super_secret_key_12345")
- `STRIPE_SECRET_KEY` - From https://dashboard.stripe.com
- `STRIPE_PUBLISHABLE_KEY` - From https://dashboard.stripe.com
- `STRIPE_WEBHOOK_SECRET` - From webhook settings in Stripe

### Step 3: Start Server
```bash
npm start
```

Server runs on `http://localhost:5000`

---

## Frontend Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add:
- `REACT_APP_API_URL=http://localhost:5000`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - From Stripe dashboard

### Step 3: Update index.js
Replace `src/index.js` with:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithProviders from './AppWithProviders';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
```

### Step 4: Start App
```bash
npm start
```

App runs on `http://localhost:3000`

---

## Testing Features

### 1. Authentication
```javascript
import useAuth from './hooks/useAuth';

function LoginExample() {
  const { login, logout, user } = useAuth();
  
  const handleLogin = async () => {
    const result = await login('user@example.com', 'password123');
    if (result.success) {
      console.log('Logged in:', result.user);
    }
  };
  
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      {user && <p>Hello {user.name}</p>}
    </div>
  );
}
```

### 2. Payment
```javascript
import PaymentForm from './Components/Payment/PaymentForm';

function PaymentExample() {
  const handleSuccess = (data) => {
    console.log('Payment succeeded!', data);
  };
  
  return (
    <PaymentForm 
      bookingId="booking123"
      amount={99.99}
      onSuccess={handleSuccess}
    />
  );
}
```

Use test card: `4242 4242 4242 4242`

### 3. Location
```javascript
import LocationTracker from './Components/Location/LocationTracker';

function LocationExample() {
  return (
    <LocationTracker 
      autoWatch={true}
      onLocationChange={(loc) => console.log(loc)}
    />
  );
}
```

---

## Common Commands

**Backend:**
```bash
# Start with nodemon (auto-reload)
npm run dev

# Run tests
npm test

# Check logs
tail -f logs/app.log
```

**Frontend:**
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## API Endpoints

### Authentication
- `POST /auth/signup` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout
- `PUT /auth/profile` - Update profile
- `POST /auth/change-password` - Change password

### Payment
- `POST /payment/create-intent` - Create payment intent
- `POST /payment/confirm` - Confirm payment
- `GET /payment/status/:id` - Get payment status
- `POST /payment/refund` - Refund payment
- `POST /payment/webhook` - Stripe webhook

### Booking
- `GET /booking` - Get all bookings
- `POST /booking` - Create booking
- `GET /booking/:id` - Get booking details
- `PUT /booking/:id` - Update booking
- `DELETE /booking/:id` - Cancel booking

---

## Stripe Setup

1. Go to https://dashboard.stripe.com
2. Get API Keys (Publishable & Secret)
3. Create webhook endpoint: `http://localhost:5000/payment/webhook`
4. Enable events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy webhook signing secret

---

## Database

### MongoDB Collections

**Users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

**Bookings**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  chef: ObjectId (ref: Chef),
  bookingDate: Date,
  status: String (pending/confirmed/cancelled),
  paymentStatus: String (pending/completed/failed/cancelled),
  paymentIntentId: String,
  amount: Number,
  numberOfGuests: Number,
  createdAt: Date
}
```

---

## Troubleshooting

**Q: "Cannot find module '@stripe/react-stripe-js'"**
A: Run `npm install` in frontend directory

**Q: "MongoDB connection refused"**
A: Make sure MongoDB is running and MONGODB_URL is correct

**Q: "Stripe key not found"**
A: Check .env file has correct keys from Stripe dashboard

**Q: "CORS error"**
A: Check FRONTEND_URL in backend .env matches frontend URL

**Q: "Token verification failed"**
A: Verify JWT_SECRET matches between requests

---

## Next Steps

1. Connect Stripe webhook in dashboard
2. Set up email notifications
3. Add image upload functionality
4. Deploy to Vercel/Heroku
5. Configure production environment

---

## Support

For detailed documentation, see `IMPLEMENTATION.md`
