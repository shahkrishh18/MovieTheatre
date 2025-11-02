// utils/auth.js
const API_BASE_URL = import.meta.API_URL;

// Get stored token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Get user data
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// Make authenticated API requests
export const authFetch = async (url, options = {}) => {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        logout();
        throw new Error('Authentication failed');
    }

    return response;
};