const mongoose = require('mongoose');
const CrouselModel = require('../models/Crousel.Model');

require('dotenv').config({ path: __dirname + '/../.env' });

const carouselData = [
  {
    title: "Join ChefKart as a Partner",
    content: "Become part of India's largest at-home cooking network and earn with your culinary skills",
    image: "/slider1.png",
    action: "Register Now"
  },
  {
    title: "Flexible Working Hours",
    content: "Work when you want, where you want. Be your own boss with ChefKart",
    image: "/slider2.png", 
    action: "Start Earning"
  },
  {
    title: "Serve Happy Families",
    content: "Bring delicious meals to thousands of households across India",
    image: "/slider3.png",
    action: "Join Us"
  },
  {
    title: "Grow Your Business",
    content: "Get access to a large customer base and grow your cooking business",
    image: "/slider4.png",
    action: "Get Started"
  }
];

async function seedCarousel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing carousel data
    await CrouselModel.deleteMany({});
    console.log('Cleared existing carousel data');

    // Insert carousel data
    await CrouselModel.insertMany(carouselData);
    console.log('Carousel data inserted successfully!');

    console.log('Carousel database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding carousel:', error);
    process.exit(1);
  }
}

seedCarousel();
