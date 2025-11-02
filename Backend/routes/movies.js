const express = require('express');
const router = express.Router();
const { getMovies, getMovie, getAvailableSeats } = require('../controllers/movieController');
const auth = require('../middleware/auth');

router.get('/', getMovies);
router.get('/:id', getMovie);
router.get('/:movieId/showtimes/:showtimeId/seats', auth, getAvailableSeats);

module.exports = router;