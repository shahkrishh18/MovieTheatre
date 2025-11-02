import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE = import.meta.env.VITE_API_URL || 'https://movietheatre-x72b.onrender.com/api';

function TicketBooking() {
    const location = useLocation();
    const navigate = useNavigate();
    const movie = location.state?.movie;
    const showTimes = movie?.showtimes || [];
    const [selectedShowtimeId, setSelectedShowtimeId] = useState(showTimes[0]?._id || '');
    const [selectedShowtime, setSelectedShowtime] = useState(showTimes[0]?.time || '');
    const [selectedSeats, setSelectedSeats] = useState([]); // numbers
    const [bookedSeats, setBookedSeats] = useState([]); // numbers
    const [basePrice, setBasePrice] = useState(0);
    const [surcharge, setSurcharge] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Fetch booked seats for selected showtime
    useEffect(() => {
      const fetchSeats = async () => {
        try {
          if (!movie || !selectedShowtimeId) return;
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
          const res = await fetch(`${API_BASE}/movies/${movie._id}/showtimes/${selectedShowtimeId}/seats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data?.success) {
            setBookedSeats(Array.isArray(data.data.bookedSeats) ? data.data.bookedSeats : []);
            setBasePrice(Number(data.data.price || 0));
            setSurcharge(Number(data.data.premiumSurcharge || 0));
          }
        } catch (e) {
          console.error('Failed to fetch seats', e);
        }
      };
      fetchSeats();
      setSelectedSeats([]); // reset selection when showtime changes
    }, [movie, selectedShowtimeId, navigate]);


    const notify = () => toast.success("Tickets booked successfully!", {
    position: "bottom-center",
    autoClose: 2500,
    theme: "dark"
    });

    // showTimes already defined above

    const rows = ['A','B','C','D','E','F','G','H','I','J'];
    const primeRows = ['D','E','F','G']; // premium band
    const seatsPerRow = 14;

    const isPrimeSeat = (seatNumber) => {
      const rowIndex = Math.floor((seatNumber - 1) / seatsPerRow);
      const rowLetter = rows[rowIndex];
      return primeRows.includes(rowLetter);
    };

    // Accessibility and couple seat rules
    const isWheelchair = (rowLetter, col) => (
      (rowLetter === 'A' && (col === 1 || col === 2 || col === seatsPerRow-1 || col === seatsPerRow)) ||
      (rowLetter === 'B' && (col === 1 || col === 2))
    );
    const coupleStartsByRow = { I: [3,5,7,9,11], J: [3,5,7,9,11] };
    const isCoupleStart = (rowLetter, col) => (coupleStartsByRow[rowLetter] || []).includes(col);
    const aisleAfters = [4, 10]; // visual gaps after these columns

    const toggleSeat = (seatNumbers) => {
        const seatArray = Array.isArray(seatNumbers) ? seatNumbers : [seatNumbers];
        setSelectedSeats(prev => {
            // If all to-be-toggled seats are already selected, deselect all; else select missing ones
            const allSelected = seatArray.every(s => prev.includes(s));
            if (allSelected) {
                return prev.filter(s => !seatArray.includes(s));
            }
            // prevent duplicates
            const merged = new Set([...prev, ...seatArray]);
            return Array.from(merged);
        });
    };

    const getCurrentPrice = () => {
        const st = showTimes.find(st => st._id === selectedShowtimeId);
        return st ? st.price : basePrice;
    };

    const getSeatStatus = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
        return 'selected';
    }
    if (bookedSeats.includes(seatNumber)) {
        return 'booked';
    }
    return 'available';
    };


    const getSeatColor = (status, prime, wheelchair=false, couple=false) => {
        if (status === 'booked') return 'bg-gray-600 border-gray-600 cursor-not-allowed';
        if (status === 'selected' && wheelchair) return 'bg-sky-500 border-sky-500';
        if (status === 'selected' && couple) return 'bg-violet-500 border-violet-500';
        if (status === 'selected' && prime) return 'bg-amber-500 border-amber-500';
        if (status === 'selected') return 'bg-red-500 border-red-500';
        if (wheelchair) return 'bg-[#1e293b] border-sky-400 hover:border-sky-300';
        if (couple) return 'bg-[#1e293b] border-violet-400 hover:border-violet-300';
        if (prime) return 'bg-[#1e293b] border-amber-400 hover:border-amber-300';
        return 'bg-[#1e293b] border-gray-500 hover:border-red-400';
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => {
      const extra = isPrimeSeat(seat) ? surcharge : 0;
      return sum + getCurrentPrice() + extra;
    }, 0);

    if (!movie) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#030213]">
                <p>No movie selected.</p>
                <button
                    onClick={() => navigate('/movies')}
                    className="mt-4 bg-red-600 px-4 py-2 rounded-lg">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col min-h-screen w-full bg-[#030213]'>
            <Navbar />
            <div className='container mx-auto py-3 px-6 flex-1' >
                <button className='flex flex-row items-center mb-5' onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} className='text-gray-300 hover:cursor-pointer mr-4' />
                    <h2 className='text-lg text-gray-300'>Movies</h2>
                </button>

                <div className='flex p-6 mb-8 bg-[#1e293b] rounded-lg'>
                    <div className='flex flex-row gap-8'>
                        <img 
                        src={movie.poster || `https://placehold.co/300x400/1e293b/ffffff?text=${encodeURIComponent(String(movie.title || 'Movie'))}`} 
                        alt={movie.title} 
                        className="w-80 h-80 object-cover rounded-lg"
                        onError={(e) => {
                            const fallback = `https://placehold.co/300x400/1e293b/ffffff?text=${encodeURIComponent(String(movie.title || 'Movie'))}`;
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                        }}
                    />
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-white text-lg font-semibold'>{movie.title}</h1>
                        {movie.description && (
                          <p className='text-gray-400'>{movie.description}</p>
                        )}
                        <div className='flex flex-row gap-3'>
                            <p className='text-gray-200'>Genre: {Array.isArray(movie.genre) ? movie.genre.join(', ') : String(movie.genre || '')}</p>
                            <p className='text-gray-200'>Duration: {movie.duration ? String(movie.duration) : ''} mins</p>
                            <p className='text-gray-200'>Rating: {movie.rating || 'PG-13'}</p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Showtime Selection */}
                <div className='mb-8'>
                    <p className='text-white font-semibold text-xl mb-4'>Select Showtime</p>
                    <div className="flex flex-wrap gap-4">
                        {showTimes.map((showtime) => (
                            <button
                                key={showtime._id}
                                onClick={() => { setSelectedShowtimeId(showtime._id); setSelectedShowtime(showtime.time); }}
                                className={`px-2 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedShowtimeId === showtime._id
                                        ? 'bg-red-600 text-white'
                                        : 'bg-[#0f172a] text-gray-300 hover:bg-[#1e293b] border border-[#334155]'
                                }`}
                            >
                                {showtime.time} &nbsp; ₹{showtime.price}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Seat Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#1e293b] rounded-lg p-6 border border-[#334155]">
                            <h2 className="text-xl font-semibold text-white mb-6 text-center">
                                Select Your Seats
                            </h2>

                            {/* Screen */}
                            <div className="mb-8">
                                <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 h-4 rounded-t-lg mx-auto max-w-2xl mb-2"></div>
                                <div className="text-center text-gray-400 text-sm font-medium mb-8">
                                    SCREEN
                                </div>
                            </div>

                            {/* Seat Legend */}
                            <div className="flex justify-center gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#1e293b] border border-gray-500 rounded-sm"></div>
                                    <span className="text-gray-400 text-sm">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 border border-red-500 rounded-sm"></div>
                                    <span className="text-gray-400 text-sm">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-600 border border-gray-600 rounded-sm"></div>
                                    <span className="text-gray-400 text-sm">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#1e293b] border border-amber-400 rounded-sm"></div>
                                    <span className="text-gray-400 text-sm">Prime (+₹{surcharge})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#1e293b] border border-violet-400 rounded-sm"></div>
                                    <span className="text-gray-400 text-sm">Couple (2 seats)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#1e293b] border border-sky-400 rounded-sm"></div>
                                    <span className="text-gray-400 text-sm">Accessible</span>
                                </div>
                            </div>

                            {/* Seats Grid */}
                            <div className="space-y-4">
                                {rows.map((row, rIdx) => (
                                    <div key={row} className="flex items-center justify-center gap-2">
                                        <div className="w-12 text-center text-gray-300 font-semibold">
                                          {row}
                                          {primeRows.includes(row) && (
                                            <span className="ml-1 text-[10px] text-amber-400">Prime</span>
                                          )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                          {(() => {
                                            const elems = [];
                                            let col = 1;
                                            while (col <= seatsPerRow) {
                                              const seatNumber = rIdx * seatsPerRow + col;
                                              const prime = isPrimeSeat(seatNumber);
                                              const wheelchair = isWheelchair(row, col);
                                              if (isCoupleStart(row, col)) {
                                                const seatA = seatNumber;
                                                const seatB = seatNumber + 1;
                                                const booked = bookedSeats.includes(seatA) || bookedSeats.includes(seatB);
                                                const selected = selectedSeats.includes(seatA) || selectedSeats.includes(seatB);
                                                const status = booked ? 'booked' : (selected ? 'selected' : 'available');
                                                elems.push(
                                                  <button
                                                    key={`${row}${col}-${col+1}`}
                                                    title={`Couple ${row}${col}-${row}${col+1}${prime ? ' (Prime)' : ''}`}
                                                    onClick={() => status !== 'booked' && toggleSeat([seatA, seatB])}
                                                    disabled={status === 'booked'}
                                                    className={`
                                                      w-16 h-8 rounded-sm border-2 flex items-center justify-center text-[10px] font-medium
                                                      transition-all duration-200
                                                      ${getSeatColor(status, prime, false, true)}
                                                      ${status === 'available' ? 'hover:scale-105' : ''}
                                                      ${status !== 'booked' ? 'cursor-pointer' : 'cursor-not-allowed'}
                                                      ${status === 'selected' ? 'text-white' : prime ? 'text-amber-300' : 'text-gray-400'}
                                                    `}
                                                  >
                                                    {row}{col}-{col+1}
                                                  </button>
                                                );
                                                if (aisleAfters.includes(col)) {
                                                  elems.push(<div key={`gap-${row}-${col}`} className="w-6" />);
                                                }
                                                col += 2;
                                                continue;
                                              }
                                              const status = getSeatStatus(seatNumber);
                                              elems.push(
                                                <button
                                                  key={`${row}${col}`}
                                                  title={`${row}${col}${prime ? ' (Prime)' : ''}${wheelchair ? ' (Accessible)' : ''}`}
                                                  onClick={() => status !== 'booked' && toggleSeat(seatNumber)}
                                                  disabled={status === 'booked'}
                                                  className={`
                                                    w-8 h-8 rounded-sm border-2 flex items-center justify-center text-xs font-medium
                                                    transition-all duration-200
                                                    ${getSeatColor(status, prime, wheelchair, false)}
                                                    ${status === 'available' ? 'hover:scale-110' : ''}
                                                    ${status !== 'booked' ? 'cursor-pointer' : 'cursor-not-allowed'}
                                                    ${status === 'selected' ? 'text-white' : prime ? 'text-amber-300' : wheelchair ? 'text-sky-300' : 'text-gray-400'}
                                                  `}
                                                >
                                                  {wheelchair ? (
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      viewBox="0 0 24 24"
                                                      width="14"
                                                      height="14"
                                                      fill="currentColor"
                                                      aria-label="Accessible seat"
                                                    >
                                                      <path d="M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-2 6h2a1 1 0 0 1 1 1v3h4a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1v-3h-1.5a4.5 4.5 0 1 0 4.31 6h2.08a6.5 6.5 0 1 1-7.89-7.64A1 1 0 0 1 10 10z" />
                                                    </svg>
                                                  ) : (
                                                    col
                                                  )}
                                                </button>
                                              );
                                              if (aisleAfters.includes(col)) {
                                                elems.push(<div key={`gap-${row}-${col}`} className="w-6" />);
                                              }
                                              col += 1;
                                            }
                                            return elems;
                                          })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1e293b] rounded-lg p-6 border border-[#334155] top-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Booking Summary</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">Movie</h3>
                                    <p className="text-gray-300">{movie.title}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Seats</h3>
                                    <p className="text-white">
                                        {selectedSeats.length > 0 
                                            ? selectedSeats.sort().join(', ')
                                            : 'No seats selected'
                                        }
                                    </p>
                                </div>

                                <div className="border-t border-[#334155] pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Tickets ({selectedSeats.length})</span>
                                        <span className="text-white">
                                          ₹{getCurrentPrice()} × {selectedSeats.length - selectedSeats.filter(isPrimeSeat).length}
                                          {selectedSeats.filter(isPrimeSeat).length > 0 && (
                                            <> &nbsp; + &nbsp; ₹{getCurrentPrice() + surcharge} × {selectedSeats.filter(isPrimeSeat).length}</>
                                          )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-[#334155]">
                                        <span className="text-lg font-semibold text-white">Total</span>
                                        <span className="text-2xl font-bold text-red-500">₹{totalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                      if (selectedSeats.length === 0) return;
                                      try {
                                        const token = localStorage.getItem('token');
                                        if (!token) { navigate('/login'); return; }
                                        const res = await fetch(`${API_BASE}/bookings`, {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                          body: JSON.stringify({ movieId: movie._id, showtimeId: selectedShowtimeId, seats: selectedSeats, totalAmount: totalPrice })
                                        });
                                        const data = await res.json();
                                        if (!res.ok || !data.success) {
                                          toast.error(data.message || 'Failed to book seats');
                                          // refresh seat map in case of conflict
                                          setSelectedSeats([]);
                                          return;
                                        }
                                        notify();
                                        setShowCelebration(true);
                                        setTimeout(() => { setShowCelebration(false); navigate('/my-bookings'); }, 1600);
                                      } catch (e) {
                                        toast.error('Booking failed');
                                      }
                                    }}
                                    disabled={selectedSeats.length === 0}
                                    className={`
                                        w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200
                                        ${selectedSeats.length > 0
                                            ? 'bg-red-600 hover:bg-red-700 hover:scale-105'
                                            : 'bg-gray-600 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {selectedSeats.length > 0 ? 'Confirm Booking' : 'Select Seats'}
                                </button>
                                <ToastContainer position="bottom-center" autoClose={2500} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showCelebration && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="popcorn-container text-center">
                  <div className="popcorn-bucket mx-auto"></div>
                  <div className="kernels">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <span key={i} className={`kernel kernel-${i+1}`}></span>
                    ))}
                  </div>
                  <p className="mt-4 text-white text-xl font-semibold">Completed!</p>
                </div>
              </div>
            )}
        </div>
    )
}

export default TicketBooking