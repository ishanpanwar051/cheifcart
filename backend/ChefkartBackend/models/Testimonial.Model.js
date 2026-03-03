const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    profileimage: { type: String }, // Field to store the image URL or path
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Database indexes for performance optimization
TestimonialSchema.index({ createdAt: -1 }); // For sorting by newest
TestimonialSchema.index({ name: 'text', content: 'text' }); // Text search index

// Middleware to update the updatedAt field before saving
TestimonialSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);