const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBooking, validateBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth, validateBooking, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/:id', auth, getBooking);

module.exports = router;