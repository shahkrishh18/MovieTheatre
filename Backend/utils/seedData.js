// import mongoose from 'mongoose';
const mongoose=require('mongoose')
// import Movie from '../models/Movie.js';
const Movie=require('../models/Movie.js')
const dotenv=require('dotenv')

dotenv.config();

const sampleMovies = [
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    genre: ["Action", "Sci-Fi"],
    duration: 136,
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    rating: 8.7,
    showtimes: [
      {
        date: new Date('2024-12-20'),
        time: "18:00",
        screen: "Screen 1",
        totalSeats: 100,
        price: 12.50
      },
      {
        date: new Date('2024-12-20'),
        time: "21:00",
        screen: "Screen 1",
        totalSeats: 100,
        price: 12.50
      },
      {
        date: new Date('2024-12-21'),
        time: "19:30",
        screen: "Screen 1",
        totalSeats: 100,
        price: 12.50
      }
    ]
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: 148,
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    rating: 8.8,
    showtimes: [
      {
        date: new Date('2024-12-20'),
        time: "17:30",
        screen: "Screen 2",
        totalSeats: 80,
        price: 14.00
      },
      {
        date: new Date('2024-12-20'),
        time: "20:30",
        screen: "Screen 2",
        totalSeats: 80,
        price: 14.00
      },
      {
        date: new Date('2024-12-21'),
        time: "20:00",
        screen: "Screen 2",
        totalSeats: 80,
        price: 14.00
      }
    ]
  },
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: ["Drama"],
    duration: 142,
    poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    rating: 9.3,
    showtimes: [
      {
        date: new Date('2024-12-21'),
        time: "19:00",
        screen: "Screen 3",
        totalSeats: 120,
        price: 10.00
      },
      {
        date: new Date('2024-12-22'),
        time: "16:00",
        screen: "Screen 3",
        totalSeats: 120,
        price: 10.00
      }
    ]
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    genre: ["Action", "Crime", "Drama"],
    duration: 152,
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    rating: 9.0,
    showtimes: [
      {
        date: new Date('2024-12-20'),
        time: "19:00",
        screen: "Screen 4",
        totalSeats: 90,
        price: 13.50
      },
      {
        date: new Date('2024-12-21'),
        time: "21:30",
        screen: "Screen 4",
        totalSeats: 90,
        price: 13.50
      }
    ]
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: ["Crime", "Drama"],
    duration: 154,
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzJjNDymMWZkZGY2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    rating: 8.9,
    showtimes: [
      {
        date: new Date('2024-12-22'),
        time: "18:30",
        screen: "Screen 2",
        totalSeats: 80,
        price: 11.00
      },
      {
        date: new Date('2024-12-22'),
        time: "21:45",
        screen: "Screen 2",
        totalSeats: 80,
        price: 11.00
      }
    ]
  },
  {
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
    genre: ["Drama", "Romance"],
    duration: 142,
    poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    rating: 8.8,
    showtimes: [
      {
        date: new Date('2024-12-21'),
        time: "15:00",
        screen: "Screen 3",
        totalSeats: 120,
        price: 9.50
      },
      {
        date: new Date('2024-12-22'),
        time: "19:15",
        screen: "Screen 3",
        totalSeats: 120,
        price: 9.50
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('✅ Cleared existing movies');

    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log(`✅ Successfully inserted ${sampleMovies.length} movies`);

    // Verify the insertion
    const movieCount = await Movie.countDocuments();
    console.log(`✅ Total movies in database: ${movieCount}`);

    // Show movie titles
    const movies = await Movie.find().select('title');
    console.log('📽️ Movies in database:');
    movies.forEach(movie => console.log(`   - ${movie.title}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();