const mongoose = require('mongoose');

const InvestorContact= new mongoose.Schema({
    
   fullname: { type: String, required: true },
    email: { type: String },
    city: { type: String, required: true },
    message: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
InvestorContact.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('InvestorContact', InvestorContact);