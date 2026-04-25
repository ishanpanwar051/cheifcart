const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
   
    category: {
        type: String,
        enum: ['For Singles', 'For Families', 'For Students','For Couples'],
        required: true
    },
    image: { type: String },
     // Field to store the image URL or path
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Database indexes for performance optimization
HomeSchema.index({ category: 1 });
HomeSchema.index({ createdAt: -1 }); // For sorting by newest
HomeSchema.index({ title: 'text', content: 'text' }); // Text search index

// Middleware to update the updatedAt field before saving
HomeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Home', HomeSchema);