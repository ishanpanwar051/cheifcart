const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String }, // Hashed password
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);