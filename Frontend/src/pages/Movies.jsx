import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://movietheatre-x72b.onrender.com/api'

const Movies = () => {

  const nav=useNavigate();
  const [searchMov, setSearchMov]=useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [movies, setMovies]=useState([]);
  const [loading, setLoading]=useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('');
        return;
      }

      const response = await fetch(`${API_BASE}/movies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('');
          return;
        }
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
      } else {
        throw new Error(data.message || 'Failed to load movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(error.message || 'Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchMovies();
    window.scrollTo({top:0, behavior:'smooth'});
  }, []);
  
  // const [movies] = useState([
  //   {
  //     id: 1,
  //     title: "Avatar: The Way of Water",
  //     genre: "Sci-Fi/Action",
  //     duration: "3h 12m",
  //     rating: 4.5,
  //     image: "https://m.media-amazon.com/images/M/MV5BYzg2NjNhNTctMjUxMi00ZWU4LWI3ZjYtNTI0NTQxNThjZTk2XkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_SX677_AL_.jpg",
  //   },
  //   {
  //     id: 2,
  //     title: "Black Panther: Wakanda Forever",
  //     genre: "Action/Adventure",
  //     duration: "2h 41m",
  //     rating: 4.2,
  //     image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Black+Panther",
  //   },
  //   {
  //     id: 3,
  //     title: "The Batman",
  //     genre: "Action/Crime",
  //     duration: "2h 56m",
  //     rating: 4.3,
  //     image: "https://via.placeholder.com/300x400/000000/FFFFFF?text=Batman",
  //   },
  //   {
  //     id: 4,
  //     title: "Top Gun: Maverick",
  //     genre: "Action/Drama",
  //     duration: "2h 11m",
  //     rating: 4.7,
  //     image: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Top+Gun",
  //   }
  // ]);

  // Extract unique genres from movies
  const allGenres = ['All Genres'];
  movies.forEach(movie => {
    if (movie.genre && Array.isArray(movie.genre)) {
      movie.genre.forEach(genre => {
        if (!allGenres.includes(genre)) {
          allGenres.push(genre);
        }
      });
    }
  });

  const filteredMov=movies.filter((movie)=>{
    const matchSearch=movie.title.toLowerCase().includes(searchMov.toLowerCase());
    const genreString = Array.isArray(movie.genre) ? movie.genre.join(', ') : String(movie.genre || '');
    const matchGenre= selectedGenre === 'All Genres' || genreString.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchGenre && matchSearch;
  })

  // Handle movie click for booking
  const handleBookTickets = (movie) => {
    navigate('/book-ticket', { state: { movie } });
  };

  // Retry loading movies
  const handleRetry = () => {
    fetchMovies();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#030213]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading movies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#030213]">
        <Navbar />
      <div className="container mx-auto py-3 px-6 flex-1">
        <div className="my-6">
          <h1 className="text-3xl font-semibold text-white mb-2">Now Showing</h1>
          <p className="text-gray-400">Book tickets for your favorite movies</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
         <div className="flex items-center gap-4 mb-8 bg-[#030213]">

            <div className="flex items-center w-full bg-[#1e293b] rounded-lg px-4 py-3 border border-[#334155] focus-within:border-[#60a5fa] transition-colors duration-200">
                <Search className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                type="text"
                value={searchMov}
                onChange={(e)=>setSearchMov(e.target.value)}
                placeholder="Search movies..."
                className="bg-transparent w-full text-white placeholder-gray-400 outline-none text-base"/>
            </div>

            {/* Genre Dropdown */}
            <select
                className="bg-[#1e293b] text-white font-semibold rounded-lg px-4 py-3 border border-[#334155] focus:border-[#60a5fa] outline-none cursor-pointer text-base min-w-[160px]"
                defaultValue="All Genres"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
            >
                {/* <option className="text-gray-900 bg-gray-100">All Genres</option>
                <option className="text-gray-900 bg-gray-100">Action</option>
                <option className="text-gray-900 bg-gray-100">Comedy</option>
                <option className="text-gray-900 bg-gray-100">Drama</option>
                <option className="text-gray-900 bg-gray-100">Horror</option>
                <option className="text-gray-900 bg-gray-100">Romance</option> */}
                {allGenres.map((genre) => (
              <option key={genre} value={genre} className="text-gray-900 bg-gray-100">
                {genre}
              </option>
            ))}
            </select>
    </div>

        {/* Movies Grid */}
        {filteredMov.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-6">
          {filteredMov.map((movie) => (
            <div key={movie._id} className="bg-[#1e293b] rounded-lg overflow-hidden hover:border hover:border-red-500 transition-all duration-200 border border-[#334155]">
              <img
                src={movie.poster || `https://via.placeholder.com/300x400/1e293b/ffffff?text=${encodeURIComponent(String(movie.title || 'Movie'))}`}
                alt={movie.title}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-contain object-cover"
                 onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x400/1e293b/ffffff?text=${encodeURIComponent(String(movie.title || 'Movie'))}`;
                  }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                  <span>{Array.isArray(movie.genre) ? movie.genre.join(', ') : String(movie.genre || '')}</span>
                  <span>{movie.duration ? String(movie.duration) : ''} mins</span>
                </div>
                <div className="flex items-center mb-4">
                  <Star className='text-yellow-400' fill='yellow' size={20} />
                  <span className="ml-1 text-sm text-gray-300">
                    {/* {movie.rating}/5 */}
                    {movie.rating ? `${movie.rating}/10` : 'No rating'}
                  </span>
                </div>

                {/* Showtimes Info */}
                  {movie.showtimes && movie.showtimes.length > 0 && (
                    <div className="mb-3 text-xs text-gray-400">
                      {movie.showtimes.length} showtime{movie.showtimes.length !== 1 ? 's' : ''} available
                    </div>
                  )}

                <button onClick={()=>nav('/book-ticket',{state: {movie}})} className="w-full bg-red-600 hover:scale-102 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200">
                  Book Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
        ):(
          <p className="text-gray-400 text-center py-10">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Movies;