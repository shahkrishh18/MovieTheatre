const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    default: 100
  },
  bookedSeats: {
    type: [Number],
    default: []
  },
  premiumSurcharge: {
    type: Number,
    default: 50
  },
  price: {
    type: Number,
    required: true
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Movie description is required']
  },
  genre: {
    type: [String],
    required: [true, 'Genre is required']
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  poster: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  showtimes: [showtimeSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);