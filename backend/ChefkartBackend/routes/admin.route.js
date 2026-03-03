const express = require('express');
const router = express.Router();
const ChefModel = require('../models/Chef.Model');
const UserModel = require('../models/User.Model');
const BookingModel = require('../models/Booking.Model');
const GalleryModel = require('../models/Gallery.Model');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Promise.all([
            ChefModel.countDocuments(),
            UserModel.countDocuments(),
            BookingModel.countDocuments(),
            GalleryModel.countDocuments(),
            BookingModel.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        const recentBookings = await BookingModel.find()
            .populate('userId', 'name email')
            .populate('chefId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        const topChefs = await ChefModel.find()
            .sort({ starRating: -1 })
            .limit(5)
            .select('name starRating totalRatings city');

        res.status(200).json({
            success: true,
            data: {
                totalChefs: stats[0],
                totalUsers: stats[1],
                totalBookings: stats[2],
                totalGallery: stats[3],
                totalRevenue: stats[4][0]?.total || 0,
                recentBookings,
                topChefs
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await UserModel.find(query)
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await UserModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Get all bookings with pagination
router.get('/bookings', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.status = status;
        }

        const bookings = await BookingModel.find(query)
            .populate('userId', 'name email')
            .populate('chefId', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await BookingModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await BookingModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId chefId');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating booking status',
            error: error.message
        });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

module.exports = router;
