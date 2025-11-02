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
      },
    ]
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    genre: ["Biography", "Drama", "History"],
    duration: 180,
    poster: "https://i.pinimg.com/736x/d3/99/1a/d3991aa8b5708a0fe948ff25a4772509.jpg",
    rating: 8.6,
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
      },
    ]
  },
  {
    title:"Spider-Man: No Way Home",
    description:"Peter Parker’s identity is revealed, bringing his superhero responsibilities into conflict with his normal life.",
    genre:["Action","Adventure","Sci-Fi"],
    duration:148,
    poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAuAaWxjt3CxKaQMrjLMlA-whTvjial1Qu9MZmyzuq_5lnB23YoBzOrH0k29ggMd-i3yeSvAYCbiO8L98zl9X1v7_zABcHggRkqwrZi0_&s=10",
    rating:8.2,
    showtimes:[
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
      },
    ],
  },
  {
    title:"Interstellar",
    description:"A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    genre:["Adventure","Drama","Sci-Fi"],
    duration:169,
    poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2F164l3556UGStHlwoVXoXA5WEG57uYhlfPOOHjeHIIVLOe-BKrR4oLPPAQUfYRL0Ql9_RCbqCxVfxfTkMriRxsw98HxMXcnvOvR7LPmNmg&s=10",
    rating:8.7,
    showtimes:[
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
      },
    ],
  },
  {
    title:"Avengers: Endgame",
    description:"After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    genre:["Action","Adventure","Drama"],
    duration:181,
    poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZn1zw4N4EgckrR-7-EbzjyDMbA7NQD7o2mQA0yDznfktmdGrEtX_XD9012y59oB45ugbY_NbCJtjn4ohCUmjzn4zS8qWfKJ56iffhha8gLA&s=10",
    rating:8.4,
    showtimes:[
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
      },
    ],
  },
  {
    title:"Dune: Part Two",
    description:"Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family.",
    genre:["Action","Adventure","Drama"],
    duration:166,
    poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwboWvdI89wR3k_fQuSP0RaoSThpBnlCf1KFS9XA1wmFWdFWxWFavfGAxYDdSr8ZfGSrMR2Z0YdOfnPUen6goO2fGAvQ6LcDZYrCxhPEe1&s=10",
    rating:8.9,
    showtimes:[
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
      },
    ],
  },
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