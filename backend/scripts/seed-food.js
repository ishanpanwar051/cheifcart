/**
 * ✅ FIXED SEED SCRIPT
 * Run: cd backend/ChefkartBackend && node scripts/seed-food.js
 * This populates the DB with sample data so images show up
 */
const mongoose = require('mongoose');
const FoodModel = require('../models/FoodgGallery.Model');
const FoodGallModel = require('../models/FoodgGall.Model');

require('dotenv').config({ path: __dirname + '/../.env' });

const sampleFoodData = [
  { image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80", name: "Chicken Biryani", cuisine: "Indian" },
  { image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", name: "Margherita Pizza", cuisine: "Italian" },
  { image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", name: "BBQ Burger", cuisine: "American" },
  { image: "https://images.unsplash.com/photo-1617196034238-26de2b6e0e56?w=400&q=80", name: "Dragon Sushi Roll", cuisine: "Japanese" },
  { image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", name: "Garden Fresh Salad", cuisine: "Healthy" },
  { image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80", name: "Mutton Biryani", cuisine: "Indian" },
];

const sampleGalleryData = [
  { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", name: "Chef Special Thali" },
  { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", name: "Gourmet Spread" },
  { image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80", name: "Chef at Work" },
  { image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", name: "Breakfast Platter" },
  { image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", name: "Pizza Fresh" },
  { image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80", name: "Continental Dish" },
];

const sampleTestimonials = [
  { name: "Priya Sharma", content: "CheifCart changed my life! I get a professional cook at home every morning. The food is delicious and hygienic.", profileimage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { name: "Rahul Mehta", content: "Best service in Delhi! The chef is punctual, professional and cooks amazing food. Highly recommended!", profileimage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Sunita Patel", content: "I was skeptical at first but CheifCart exceeded my expectations. My family loves the food every single day.", profileimage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    await FoodModel.deleteMany({});
    await FoodGallModel.deleteMany({});

    // Also seed testimonials
    try {
      const TestimonialModel = require('../models/Testimonial.Model');
      await TestimonialModel.deleteMany({});
      await TestimonialModel.insertMany(sampleTestimonials);
      console.log('✅ Testimonials seeded');
    } catch (e) { console.log('Testimonial seed skipped:', e.message); }

    await FoodModel.insertMany(sampleFoodData);
    await FoodGallModel.insertMany(sampleGalleryData);

    console.log('✅ Food data seeded successfully!');
    console.log('✅ Gallery data seeded successfully!');
    console.log('\n🎉 Database seeded! Run your app now.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedData();
