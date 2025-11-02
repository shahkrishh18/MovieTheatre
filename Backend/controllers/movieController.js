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

// Generate today's full-day showtimes (9:00–23:00) for ALL movies
// Skips existing showtimes with same date+time; sets variable base price per slot
const generateTodayForAll = async (req, res) => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0,10); // YYYY-MM-DD

    // Default slots if not provided in body
    const defaultSlots = ['09:00 AM','11:30 AM','02:00 PM','04:30 PM','07:00 PM','09:30 PM','11:00 PM'];
    const slots = Array.isArray(req.body?.times) && req.body.times.length ? req.body.times : defaultSlots;

    // Price template by slot group (these are BASE prices before adjustedPrice multiplier)
    const baseForHour = (h) => {
      if (h < 12) return 160;   // Morning
      if (h < 16) return 170;   // Matinee
      if (h < 21) return 200;   // Evening
      return 150;               // Late night
    };

    const movies = await Movie.find({});
    let created = 0;

    for (const movie of movies) {
      for (const t of slots) {
        const dt = toDateTime(todayStr, t);
        const exists = (movie.showtimes || []).some(st => {
          const sdt = toDateTime(st.date, st.time);
          return sdt.getFullYear() === dt.getFullYear() && sdt.getMonth() === dt.getMonth() && sdt.getDate() === dt.getDate() && st.time === t;
        });
        if (exists) continue;

        const base = baseForHour(dt.getHours());
        movie.showtimes.push({
          time: t,
          date: dt,
          screen: movie.title?.slice(0,3).toUpperCase(),
          totalSeats: 140,
          bookedSeats: [],
          price: base,
          premiumSurcharge: 50
        });
        created++;
      }
      await movie.save();
    }

    return res.status(201).json({ success: true, message: 'Generated today showtimes for all movies', data: { created, slots } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error generating showtimes', error: error.message });
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

// helpers
const parseTime12h = (timeStr) => {
  // expects e.g. "10:30 AM" or "09:00 PM"
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let [_, h, m, ap] = match;
  h = parseInt(h, 10);
  const min = parseInt(m, 10);
  if (ap.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (ap.toUpperCase() === 'AM' && h === 12) h = 0;
  return { hour: h, minute: min };
};

const toDateTime = (dateVal, timeStr) => {
  const base = new Date(dateVal || new Date());
  const t = parseTime12h(timeStr);
  if (!t) return new Date(base);
  const d = new Date(base);
  d.setHours(t.hour, t.minute, 0, 0);
  return d;
};

const slotMultiplier = (dt) => {
  const h = dt.getHours();
  if (h < 12) return 0.90;        // Morning
  if (h < 16) return 1.00;        // Matinee
  if (h < 21) return 1.20;        // Evening
  return 0.85;                    // Late night
};

const adjustedPrice = (showtime) => {
  const dt = toDateTime(showtime.date, showtime.time);
  const mult = slotMultiplier(dt);
  const base = Number(showtime.price || 0);
  return Math.round(base * mult);
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

    // Dynamic base price based on time-of-day
    const price = adjustedPrice(showtime);

    res.json({
      success: true,
      data: {
        availableSeats,
        totalSeats: showtime.totalSeats,
        bookedSeats: showtime.bookedSeats,
        screen: showtime.screen,
        price,
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

// Add multiple showtimes with variable pricing
const addShowtimes = async (req, res) => {
  try {
    const { id } = req.params;
    const { showtimes } = req.body; // [{time,date,screen,price,premiumSurcharge,totalSeats}]

    if (!Array.isArray(showtimes) || showtimes.length === 0) {
      return res.status(400).json({ success: false, message: 'showtimes array is required' });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const sanitized = showtimes.map(st => ({
      time: st.time,
      date: st.date ? new Date(st.date) : new Date(),
      screen: st.screen || movie.title?.slice(0, 3).toUpperCase(),
      totalSeats: Number(st.totalSeats) || 140,
      bookedSeats: [],
      price: Number(st.price) || 150,
      premiumSurcharge: typeof st.premiumSurcharge === 'number' ? st.premiumSurcharge : 50
    }));

    movie.showtimes.push(...sanitized);
    await movie.save();

    return res.status(201).json({ success: true, message: 'Showtimes added', data: movie.showtimes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding showtimes', error: error.message });
  }
};

// Update a single showtime's price/surcharge/time
const updateShowtime = async (req, res) => {
  try {
    const { movieId, showtimeId } = req.params;
    const { price, premiumSurcharge, time, date, screen, totalSeats } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    const st = movie.showtimes.id(showtimeId);
    if (!st) return res.status(404).json({ success: false, message: 'Showtime not found' });

    if (typeof price === 'number') st.price = price;
    if (typeof premiumSurcharge === 'number') st.premiumSurcharge = premiumSurcharge;
    if (typeof time === 'string') st.time = time;
    if (typeof screen === 'string') st.screen = screen;
    if (date) st.date = new Date(date);
    if (typeof totalSeats === 'number') st.totalSeats = totalSeats;

    await movie.save();
    return res.json({ success: true, message: 'Showtime updated', data: st });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating showtime', error: error.message });
  }
};

// Get today's showtimes for a movie between 9:00 and 23:00; mark past vs upcoming
const getTodayShowtimes = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    const now = new Date();
    const dayStart = new Date(now); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(now); dayEnd.setHours(23,59,59,999);
    const slotStart = new Date(dayStart); slotStart.setHours(9,0,0,0);   // 9:00 AM
    const slotEnd = new Date(dayStart); slotEnd.setHours(23,0,0,0);      // 11:00 PM

    const todayShows = (movie.showtimes || [])
      .map(st => ({ st, dt: toDateTime(st.date, st.time) }))
      .filter(({ dt }) => dt >= dayStart && dt <= dayEnd && dt >= slotStart && dt <= slotEnd)
      .sort((a,b) => a.dt - b.dt)
      .map(({ st, dt }) => ({
        _id: st._id,
        time: st.time,
        date: dt,
        screen: st.screen,
        totalSeats: st.totalSeats,
        price: adjustedPrice(st),
        premiumSurcharge: st.premiumSurcharge || 0,
        isPast: dt < now
      }));

    return res.json({ success: true, data: todayShows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching today showtimes', error: error.message });
  }
};

module.exports = {
  getMovies,
  getMovie,
  getAvailableSeats,
  addShowtimes,
  updateShowtime,
  getTodayShowtimes,
  generateTodayForAll
};