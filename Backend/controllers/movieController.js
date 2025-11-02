const Movie = require('../models/Movie');

// Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: movies,
      count: movies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movies',
      error: error.message
    });
  }
};

// Get single movie
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movie',
      error: error.message
    });
  }
};

// Get available seats for a showtime
const getAvailableSeats = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const showtime = movie.showtimes.id(req.params.showtimeId);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }

    const availableSeats = [];
    for (let i = 1; i <= showtime.totalSeats; i++) {
      if (!showtime.bookedSeats.includes(i)) {
        availableSeats.push(i);
      }
    }

    res.json({
      success: true,
      data: {
        availableSeats,
        totalSeats: showtime.totalSeats,
        bookedSeats: showtime.bookedSeats,
        screen: showtime.screen,
        price: showtime.price,
        premiumSurcharge: showtime.premiumSurcharge || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available seats',
      error: error.message
    });
  }
};

module.exports = {
  getMovies,
  getMovie,
  getAvailableSeats
};