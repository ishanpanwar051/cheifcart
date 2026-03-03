const mongoose = require('mongoose');
const JoinModel = require('../models/Join.Model');

require('dotenv').config({ path: __dirname + '/../.env' });

const joinData = [
  {
    title: "Flexible Working Hours",
    content: "Work when you want, where you want. Complete control over your schedule and work-life balance.",
    image: "/slider1.png"
  },
  {
    title: "Good Earnings", 
    content: "Earn competitive rates and grow your income with every satisfied customer. Performance-based rewards.",
    image: "/slider2.png"
  },
  {
    title: "Training & Support",
    content: "Get professional training and ongoing support to enhance your culinary skills and service quality.",
    image: "/slider3.png"
  },
  {
    title: "Large Customer Base",
    content: "Access to thousands of families across India looking for trusted home cooking services.",
    image: "/slider4.png"
  },
  {
    title: "Growth Opportunities",
    content: "Build your own cooking business with ChefKart's platform and grow professionally.",
    image: "/image.png"
  },
  {
    title: "Community Support",
    content: "Join a community of skilled chefs and share experiences, recipes, and opportunities.",
    image: "/slider1.png"
  }
];

async function seedJoin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing join data
    await JoinModel.deleteMany({});
    console.log('Cleared existing join data');

    // Insert join data
    await JoinModel.insertMany(joinData);
    console.log('Join data inserted successfully!');

    console.log('Join database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding join data:', error);
    process.exit(1);
  }
}

seedJoin();
