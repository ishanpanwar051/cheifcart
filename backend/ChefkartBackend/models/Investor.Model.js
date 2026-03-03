const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    image: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
InvestorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Investor', InvestorSchema);