const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const validateBooking = [
  body('seats').isArray({ min: 1 }).withMessage('At least one seat must be selected'),
  body('seats.*').isInt({ min: 1 }).withMessage('Invalid seat number'),
  handleValidationErrors
];

// Create booking
const createBooking = async (req, res) => {
  try {
    const { movieId, showtimeId, seats } = req.body;

    // Basic input checks
    if (!movieId || !showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'movieId, showtimeId and seats are required' });
    }

    // Ensure movie and showtime exist
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    const showtime = movie.showtimes.id(showtimeId);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Atomic update: only add seats if none are currently booked
    const updateResult = await Movie.updateOne(
      { _id: movieId, showtimes: { $elemMatch: { _id: showtimeId, bookedSeats: { $nin: seats } } } },
      { $addToSet: { 'showtimes.$.bookedSeats': { $each: seats } } },
      {}
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(409).json({ success: false, message: 'Some seats are already booked. Please refresh seat map.' });
    }

    // Calculate total amount after successful seat lock
    // If client provided a computed total (e.g., including prime surcharge), trust it for now.
    // Fallback to base calculation.
    const totalAmount = typeof req.body.totalAmount === 'number'
      ? req.body.totalAmount
      : seats.length * showtime.price;

    const created = await Booking.create({
      user: req.user._id,
      movie: movieId,
      showtime: { date: showtime.date, time: showtime.time, screen: showtime.screen },
      seats,
      totalAmount
    });

    await created.populate('movie', 'title poster');
    return res.status(201).json({ success: true, message: 'Booking confirmed successfully', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster duration')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('movie', 'title poster genre');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  validateBooking
};