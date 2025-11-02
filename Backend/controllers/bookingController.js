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

    // Find movie and showtime
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const showtime = movie.showtimes.id(showtimeId);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }

    // Check seat availability
    const unavailableSeats = seats.filter(seat => 
      showtime.bookedSeats.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${unavailableSeats.join(', ')} are already booked`
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * showtime.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      showtime: {
        date: showtime.date,
        time: showtime.time,
        screen: showtime.screen
      },
      seats,
      totalAmount
    });

    // Update booked seats
    showtime.bookedSeats.push(...seats);
    await movie.save();

    // Populate booking details
    await booking.populate('movie', 'title poster');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
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