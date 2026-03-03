const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    
    servicename: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
ServiceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Service', ServiceSchema);