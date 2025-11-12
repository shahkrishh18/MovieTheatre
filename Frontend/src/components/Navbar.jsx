import { Film, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
const API_BASE = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      if (!u) return '';
      const obj = JSON.parse(u);
      return (
        obj?.name ||
        obj?.fullName ||
        obj?.user?.name ||
        (typeof obj === 'object' && obj !== null && typeof obj.email === 'string' ? obj.email.split('@')[0] : '') ||
        ''
      );
    } catch { return ''; }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        const name = data?.data?.user?.name || data?.data?.name || data?.user?.name || '';
        if (name) setDisplayName(name);
      } catch (_) {
      }
    })();
  }, [navigate]);

  return (
    <nav className="z-50 bg-gray-800 items-center sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex flex-row gap-3 items-center">
                <Film size={34} className='text-red-500' />
              <span className="text-white text-xl font-semibold">CinemaBook</span>
            </div>

            <div className="hidden md:flex md:space-x-8">
              <Link
                to="/movies"
                className="text-white hover:rounded-xl hover:bg-gray-100 hover:text-black px-3 py-2 font-medium"
              >
                Movies
              </Link>
              <Link
                to="/my-bookings"
                className="text-white items-center gap-2 flex flex-row hover:rounded-xl hover:bg-gray-100 hover:text-black px-3 py-2 font-medium"
              >
                <Ticket size={20} />
                My Bookings
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white text-lg font-medium">
              {displayName || 'User'}
            </span>
            <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button (hidden on desktop) */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/movies" 
            className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Movies
          </Link>
          <Link 
            to="/my-bookings" 
            className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;