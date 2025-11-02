import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Movies from './pages/Movies';
import Booking from './pages/Booking';
import TicketBooking from './components/TicketBooking';
import { isAuthenticated } from './utils/auth';

const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<Login />} /> 
        <Route path='/movies' element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        } />
        <Route path='/my-bookings' element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path='/book-ticket' element={<TicketBooking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

