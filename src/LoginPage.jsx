import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      if (formData.email && formData.password) {
        // Set authentication status
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', formData.email);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Login</h2>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-neutral-800 border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-neutral-800 border-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-500 hover:text-purple-400">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
