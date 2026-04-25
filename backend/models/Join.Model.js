const mongoose = require('mongoose');

const JoinSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
JoinSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Join', JoinSchema);