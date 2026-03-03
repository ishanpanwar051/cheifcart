const mongoose = require('mongoose');

const FoodGallerSchema = new mongoose.Schema({
    
 
    image: { type: String },
     // Field to store the image URL or path
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
FoodGallerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FoodGaller', FoodGallerSchema);