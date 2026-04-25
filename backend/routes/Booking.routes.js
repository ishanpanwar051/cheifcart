const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = require('../controller/Booking.Controller');
const { verifyToken, isAdmin } = require('../middleware/AuthMiddleware')
const router = require('express').Router();

router.post('/createBook', verifyToken, createBooking);
router.get('/get', verifyToken, isAdmin, getBookings);
router.get('/get/:id', verifyToken, getBookingById);
router.put('/update/:id', verifyToken, isAdmin, updateBooking);

router.delete('/delete/:id', verifyToken, isAdmin, deleteBooking);
module.exports = router;
