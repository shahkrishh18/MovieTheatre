import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TicketBooking() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedShowtime, setSelectedShowtime] = useState('02:00 PM');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Generate random booked seats once on mount
const [bookedSeats, setBookedSeats] = useState([]);

useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 10;
  const totalSeats = rows.length * seatsPerRow;
  
  const randomSeatCount = Math.floor(Math.random() * 8) + 5; // 5–12 booked seats
  const allSeatIds = rows.flatMap(row => 
    Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`)
  );

  const randomSeats = [];
  while (randomSeats.length < randomSeatCount) {
    const randomSeat = allSeatIds[Math.floor(Math.random() * totalSeats)];
    if (!randomSeats.includes(randomSeat)) {
      randomSeats.push(randomSeat);
    }
  }
  setBookedSeats(randomSeats);
}, []);


    const movie = location.state?.movie;

    const notify = () => toast.success("🎟️ Tickets booked successfully!", {
    position: "bottom-center",
    autoClose: 2500,
    theme: "dark"
    });

    const showTimes=[
        {time: '11:00 AM', price: 120},
        {time: '2:00 PM', price: 150},
        {time: '5:30 PM', price: 180},
        {time: '7:00 PM', price: 200},
        {time: '11:00 PM', price: 220},
    ]

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 10;

    const toggleSeat = (seatId) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(seat => seat !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const getCurrentPrice = () => {
        const showtime = showTimes.find(st => st.time === selectedShowtime);
        return showtime ? showtime.price : 120; // fallback to $12
    };

    const getSeatStatus = (seatId) => {
    if (selectedSeats.includes(seatId)) {
        return 'selected';
    }
    if (bookedSeats.includes(seatId)) {
        return 'booked';
    }
    return 'available';
    };


    const getSeatColor = (status) => {
        switch (status) {
            case 'selected':
                return 'bg-red-500 border-red-500';
            case 'booked':
                return 'bg-gray-600 border-gray-600 cursor-not-allowed';
            default:
                return 'bg-[#1e293b] border-gray-500 hover:border-red-400';
        }
    };

    const totalPrice = selectedSeats.length * getCurrentPrice();

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
                        src={movie.image} 
                        alt="Quantum Nexus Poster" 
                        className="w-80 h-80 object-cover rounded-lg"
                    />
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-white text-lg font-semibold'>{movie.title}</h1>
                        <p className='text-gray-400'>A thrilling sci-fi adventure where a team of scientists discovers a parallel dimension that threatens to merge with our reality.</p>
                        <div className='flex flex-row gap-3'>
                            <p className='text-gray-200'>Genre: {movie.genre}</p>
                            <p className='text-gray-200'>Duration: {movie.duration}</p>
                            <p className='text-gray-200'>Rating: PG-13</p>
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
                                key={showtime.time}
                                onClick={() => setSelectedShowtime(showtime.time)}
                                className={`px-2 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedShowtime === showtime.time
                                        ? 'bg-red-600 text-white'
                                        : 'bg-[#0f172a] text-gray-300 hover:bg-[#1e293b] border border-[#334155]'
                                }`}
                            >
                                Oct 31 &nbsp; {showtime.time} &nbsp; ₹{showtime.price}
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
                            </div>

                            {/* Seats Grid */}
                            <div className="space-y-4">
                                {rows.map((row) => (
                                    <div key={row} className="flex items-center justify-center gap-2">
                                        <div className="w-6 text-center text-gray-400 font-medium">{row}</div>
                                        <div className="flex gap-2">
                                            {Array.from({ length: seatsPerRow }, (_, index) => {
                                                const seatNumber = index + 1;
                                                const seatId = `${row}${seatNumber}`;
                                                const status = getSeatStatus(seatId);
                                                
                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => status !== 'booked' && toggleSeat(seatId)}
                                                        disabled={status === 'booked'}
                                                        className={`
                                                            w-8 h-8 rounded-sm border-2 flex items-center justify-center text-xs font-medium
                                                            transition-all duration-200
                                                            ${getSeatColor(status)}
                                                            ${status === 'available' ? 'hover:scale-110' : ''}
                                                            ${status !== 'booked' ? 'cursor-pointer' : 'cursor-not-allowed'}
                                                            ${status === 'selected' ? 'text-white' : 'text-gray-400'}
                                                        `}
                                                    >
                                                        {seatNumber}
                                                    </button>
                                                );
                                            })}
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

                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-red-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Date</h3>
                                        <p className="text-white">Oct 31, 2025</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-red-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Time</h3>
                                        <p className="text-white">{selectedShowtime}</p>
                                    </div>
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
                                        <span className="text-white">₹{getCurrentPrice()} × {selectedSeats.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-[#334155]">
                                        <span className="text-lg font-semibold text-white">Total</span>
                                        <span className="text-2xl font-bold text-red-500">${totalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                    if (selectedSeats.length > 0) {
                                        notify();
                                        setTimeout(() => {
                                        navigate('/movies');
                                        }, 2500); // wait for toast to finish
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
        </div>
    )
}

export default TicketBooking