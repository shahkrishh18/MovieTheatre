import React,{use, useState} from 'react'
import Navbar from '../components/Navbar'
import { Calendar, Clock, IndianRupeeIcon, Sofa, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function Booking() {

  const [BookedMov, setBookedSeats]=useState(false);
  const nav=useNavigate();

  return (
    <div className='flex flex-col h-screen w-full bg-[#030213]'>
      <Navbar />
      <div className="container mx-auto py-3 px-6 flex-1">
        <div className="my-6">
          <h1 className="text-3xl font-semibold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">View your movie ticket bookings</p>
        </div>

        {BookedMov ? (
          <div className="bg-[#0f0f2d] flex flex-row rounded-2xl border border-gray-400 overflow-hidden mx-auto">
          <img src="https://m.media-amazon.com/images/M/MV5BYzg2NjNhNTctMjUxMi00ZWU4LWI3ZjYtNTI0NTQxNThjZTk2XkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_SX677_AL_.jpg" alt="Quantum Nexus" className="w-48 h-auto object-cover" />

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Quantum Nexus</h2>
                <p className="text-[#8b8ba5] text-sm">Sci-Fi</p>
              </div>
              <span className="bg-[#1f1f4d] text-[#8b8ba5] text-xs font-semibold px-3 py-1 rounded-full">
                Completed
              </span>
            </div>
            <div className="flex flex-row items-center space-x-18 text-white my-6">
              <div className="flex items-center space-x-2">
                <Calendar className="text-[#8b8ba5] text-2xl" />
                <div>
                  <p className="text-xs text-[#8b8ba5]">Date</p>
                  <p className="font-medium">Oct 31, 2025</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-[#8b8ba5] text-2xl" />
                <div>
                  <p className="text-xs text-[#8b8ba5]">Time</p>
                  <p className="font-medium">02:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sofa className="text-[#8b8ba5] text-2xl" />
                <div>
                  <p className="text-xs text-[#8b8ba5]">Seats</p>
                  <p className="font-medium">B4, C5, D6, B4, C5, D6</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IndianRupeeIcon className="text-[#8b8ba5] text-2xl" />
                <div>
                  <p className="text-xs text-[#8b8ba5]">Total</p>
                  <p className="font-medium">36</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[#8b8ba5] text-sm font-mono">
                Booking ID: 1762030040988
              </p>
            </div>
          </div>
        </div>
        ):(
          <div className="bg-[#0f0f2d] flex flex-col items-center rounded-2xl py-5 border border-gray-400 overflow-hidden mx-auto">
            <Ticket size={50} className='text-2xl text-gray-500 font-bold' />
            <div className='my-6' >
              <p className='font-semibold text-xl text-center text-white mb-1' >No Bookings Yet</p>
              <p className=' text-md text-gray-400'>You haven't booked any movie tickets yet. Start browsing movies to make your first booking!</p>
            </div>
            <button onClick={()=>nav(-1)} className='py-1.5 px-4 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600' >Browse Movies</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking
