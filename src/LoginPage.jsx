import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    
    // For now, we'll just redirect to dashboard
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col pt-20">
      {/* Header */}
      <Header />

      {/* Main Content - Login Form */}
      <div className="flex flex-col items-center justify-center flex-grow p-10">
        <div className="flex flex-col md:flex-row gap-10 p-10 bg-gray-800 rounded-lg shadow-lg w-full md:w-[900px]">
          {/* Welcome Section */}
          <div className="text-center md:text-left md:flex-1">
            <h1 className="text-5xl font-bold">
              BrightPath <span className="text-purple-500">AI</span>
            </h1>
            <h2 className="mt-4 text-2xl font-semibold">Welcome Back!</h2>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md bg-gray-700 p-8 rounded-lg relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 bg-gradient-to-r from-blue-500 to-purple-600 h-20 w-20 rounded-full opacity-30 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 bg-gradient-to-r from-purple-600 to-blue-500 h-20 w-20 rounded-full opacity-30 blur-xl"></div>
            <h3 className="text-2xl font-semibold">Login</h3>
            <p className="text-gray-400 mt-2 mb-6">Glad you're back!</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>

            <div className="mt-6">
              <p className="text-center text-gray-400 mb-4">Or continue with</p>
              <div className="flex justify-center gap-4">
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition-colors">
                  <FaGoogle className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition-colors">
                  <FaFacebookF className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition-colors">
                  <FaGithub className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LoginPage;
