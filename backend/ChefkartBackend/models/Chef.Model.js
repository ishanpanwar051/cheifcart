const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
    name: { type: String, required: true },
    Address: { type: String, required: true },
    profilepic: { type: String },
    default_cook_image: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    area: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    verified: { type: Boolean, default: false },
    starRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    language: [{ type: String }], // e.g., ["Hin"]
    veg: { type: Boolean, default: false },
    nonVeg: { type: Boolean, default: false },
    aboutCook: { type: String },
    cuisineRatings: [{
        cuisine: { type: String },
        rating: { type: Number }
    }],
    availableLocations: [{ type: String }], // e.g., ["Emerald Hills(Coral), Sector 65, Gurgaon"]
    availability: [{
        start: { type: String }, // "05:00 AM"
        end: { type: String }    // "12:30 PM"
    }],
    housesServed: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Database indexes for performance optimization
ChefSchema.index({ email: 1 }, { unique: true });
ChefSchema.index({ city: 1, state: 1 });
ChefSchema.index({ starRating: -1 });
ChefSchema.index({ verified: 1 });
ChefSchema.index({ name: 'text', aboutCook: 'text', city: 'text' }); // Text search index
ChefSchema.index({ createdAt: -1 }); // For sorting by newest

// Middleware to update the updatedAt field before saving
ChefSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Chef', ChefSchema);
