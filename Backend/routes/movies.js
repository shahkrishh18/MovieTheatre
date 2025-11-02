const express = require('express');
const router = express.Router();
const { getMovies, getMovie, getAvailableSeats, addShowtimes, updateShowtime, getTodayShowtimes, generateTodayForAll } = require('../controllers/movieController');
const auth = require('../middleware/auth');

router.get('/', getMovies);
router.get('/:id', getMovie);
router.get('/:id/today-showtimes', getTodayShowtimes);
router.get('/:movieId/showtimes/:showtimeId/seats', auth, getAvailableSeats);
// Management routes (optionally protect with auth)
router.post('/:id/showtimes', addShowtimes);
router.patch('/:movieId/showtimes/:showtimeId', updateShowtime);
router.post('/generate-today', generateTodayForAll);

module.exports = router;