const mongoose = require('mongoose');

const BookingSchema=new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    bookingDate: { type: Date, required: true },
    
    status: { 
        type: String, 
        enum: ['booked', 'non-booked'], // Updated status options
        default: 'non-booked' // Default to "non-booked"
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Database indexes for performance optimization
BookingSchema.index({ user: 1 });
BookingSchema.index({ chef: 1 });
BookingSchema.index({ bookingDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ user: 1, bookingDate: -1 }); // Compound index for user bookings
BookingSchema.index({ chef: 1, bookingDate: -1 }); // Compound index for chef bookings

module.exports=mongoose.model('Booking',BookingSchema);