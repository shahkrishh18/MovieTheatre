import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Calendar, Clock, IndianRupeeIcon, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_URL;

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) { nav(''); return; }
        const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load bookings');
        }
        setBookings(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        setError(e.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav]);

  return (
    <div className='flex flex-col min-h-screen w-full bg-[#030213]'>
      <Navbar />
      <div className="container mx-auto py-3 px-6 flex-1">
        <div className="my-6">
          <h1 className="text-3xl font-semibold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">View your movie ticket bookings</p>
        </div>

        {loading && (
          <div className="text-gray-400">Loading your bookings...</div>
        )}

        {error && !loading && (
          <div className="text-red-400 mb-4">{error}</div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="bg-[#0f0f2d] flex flex-col items-center rounded-2xl py-5 border border-gray-400 overflow-hidden mx-auto">
            <Ticket size={50} className='text-2xl text-gray-500 font-bold' />
            <div className='my-6' >
              <p className='font-semibold text-xl text-center text-white mb-1' >No Bookings Yet</p>
              <p className=' text-md text-gray-400'>You haven't booked any movie tickets yet. Start browsing movies to make your first booking!</p>
            </div>
            <button onClick={()=>nav('/movies')} className='py-1.5 px-4 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600' >Browse Movies</button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-[#0f0f2d] flex flex-row rounded-2xl border border-gray-700 overflow-hidden">
                <img src={b.movie?.poster || `https://placehold.co/200x260/1e293b/ffffff?text=${encodeURIComponent(b.movie?.title || 'Movie')}`} alt={b.movie?.title} className="w-40 h-auto object-cover" onError={(e)=>{ const f=`https://placehold.co/200x260/1e293b/ffffff?text=${encodeURIComponent(b.movie?.title || 'Movie')}`; if(e.currentTarget.src!==f){e.currentTarget.src=f;} }} />
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">{b.movie?.title}</h2>
                      <p className="text-[#8b8ba5] text-sm">Seats: {Array.isArray(b.seats) ? b.seats.join(', ') : ''}</p>
                    </div>
                    <span className="bg-[#1f1f4d] text-[#8b8ba5] text-xs font-semibold px-3 py-1 rounded-full">
                      {b.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-white my-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-[#8b8ba5]" />
                      <div>
                        <p className="text-xs text-[#8b8ba5]">Date</p>
                        <p className="font-medium">{b.showtime?.date ? new Date(b.showtime.date).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-[#8b8ba5]" />
                      <div>
                        <p className="text-xs text-[#8b8ba5]">Time</p>
                        <p className="font-medium">{b.showtime?.time || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupeeIcon className="text-[#8b8ba5]" />
                      <div>
                        <p className="text-xs text-[#8b8ba5]">Total</p>
                        <p className="font-medium">₹{b.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#8b8ba5] text-xs font-mono">Booking ID: {b._id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking
