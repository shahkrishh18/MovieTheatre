import { useState, useEffect } from "react";
import { Film } from "lucide-react"
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL;

export default function Login() {

    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState(true);
    const [fullName, setFullName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      nav('/movies');
    }
  }, [nav]);

  const handleLogin=async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res=await fetch(`${API_BASE}/auth/login`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      });

      const data = await res.json();

      if(data.success){
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        nav('/movies');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPass) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullName,
                    email,
                    password,
                    confirmPassword: confirmPass
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                // Navigate to movies page
                nav('/movies');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        if (loginMethod) {
            handleLogin(e);
        } else {
            handleSignup(e);
        }
    };

    const toggleLoginMethod = () => {
        setLoginMethod(!loginMethod);
        setError('');
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPass('');
    };

  return (
    <div className='flex justify-center items-center h-screen w-full bg-[#030213]' >
      <div className='flex flex-col items-center p-5 bg-gray-900 rounded-2xl justify-center items-center' >
        <Film size={40} className="text-red-500 mb-4"/>
        <h3 className="text-white font-semibold text-lg mb-1" >{loginMethod?'Welcome Back':'Create Account'}</h3>
        <p className="text-blue-200 mb-2">{loginMethod? 'Sign in to book your movie tickets' : 'Sign up to start booking tickets'}</p>
        {/* Error Message */}
                {error && (
                    <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
        <form onSubmit={handleSubmit}>
            {loginMethod ? (
                <>
              <div className="my-2 text-left">
                <label className="block text-gray-200 mb-1 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-100 px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-gray-200 mb-1 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-100 px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <button className="my-2 self-center w-full bg-red-500 p-2 rounded-lg text-white font-semibold hover:bg-red-600 " >Sign In</button>
            </>
            ):(
              <>
              <div className="my-2 text-left">
                <label className="block text-gray-200 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-100 px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div className="my-2 text-left">
                <label className="block text-gray-200 mb-1 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-100 px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-gray-200 mb-1 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-100 px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-gray-200 mb-1 font-medium">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••"
                  id="confirmpass"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-100 px-4 py-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading} className="my-2 self-center w-full bg-red-500 p-2 rounded-lg text-white font-semibold hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors " >
                {/* {loginMethod ? 'Sign In': 'Sign Up'} */}
                {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {loginMethod ? 'Signing In...' : 'Creating Account...'}
                            </span>
                        ) : (
                            loginMethod ? 'Sign In' : 'Sign Up'
                        )}

              </button>
            </>
            )}
        </form>
        
        <button
          onClick={toggleLoginMethod}
          disabled={loading}
          className="w-full mt-3 text-gray-400 text-sm hover:text-gray-100 disabled:opacity-50 transition-colors"
        >
          {loginMethod ? (
            <>Don't have an account? <span className="text-red-600">Sign up</span></>
          ) : (
            <>Already have an account? <span className="text-red-600">Sign in</span></>
          )}
        </button>
      </div>
    </div>

  )
}
