# 🚀 CheifCart - Setup Guide (FIXED VERSION)

## ✅ Problems Fixed:
1. **Images not showing** → Added fallback Unsplash images (works even without DB data)
2. **Slider broken** → Fixed with auto-slide + dark overlay
3. **Gallery empty** → Shows demo images when DB is empty
4. **Testimonials missing** → Shows fallback testimonials automatically
5. **Banner text invisible** → Fixed overlay
6. **Image errors** → Proper onError handlers on all images

---

## 🔧 Step 1: Backend Setup

```bash
cd backend/ChefkartBackend
npm install
```

### Edit .env file:
```
MONGODB_URL=mongodb://127.0.0.1:27017/chefkart
PORT=3000
JWT_SECRET=supersecretkey123
FRONTEND_URL=http://localhost:3001
NODE_ENV=development

# Optional - only needed for image uploads via admin
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Start backend:
```bash
npm run dev
# Backend runs at: http://localhost:3000
```

---

## 🎨 Step 2: Frontend Setup

```bash
cd frontend/ChefkarFrontend1
npm install
npm start
# Frontend runs at: http://localhost:3001
```

---

## 🌱 Step 3: Seed Database (Optional but recommended)

```bash
cd backend/ChefkartBackend
node scripts/seed-food.js
```
This adds sample food images and testimonials to MongoDB.

---

## 📌 Important Notes:

| Feature | Without MongoDB | With MongoDB |
|---------|----------------|--------------|
| Slider | ✅ Works | ✅ Works |
| Gallery | ✅ Shows demo images | ✅ Shows DB images |
| Testimonials | ✅ Shows demo data | ✅ Shows DB data |
| Food Section | ✅ Shows demo food | ✅ Shows DB food |
| Chef Search | ❌ Empty | ✅ Works after adding chefs |
| Booking | ❌ Needs DB | ✅ Works |

## 🔑 Common Issues:

**CORS Error?** → Backend `.env` mein `FRONTEND_URL=http://localhost:3001` set karo

**Port already in use?** → `PORT=3002 npm run dev`

**Images still not showing?** → Check browser console for errors. All components now have fallback images.
