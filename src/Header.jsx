import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = location.pathname === "/dashboard" || sessionStorage.getItem("isLoggedIn") === "true";

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" onClick={handleLogoClick} className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f09e9fa03b8beaf4c4380580f518434e31f55e1110f5cdeb0db09781d38cdec?placeholderIfAbsent=true&apiKey=8f9f1b856d314aa1a6c7a43973a79627"
                alt="BrightPath AI logo"
                className="h-8 w-auto"
              />
              <span className="text-white font-bold text-xl hidden sm:block">
                BrightPath <span className="text-purple-500">AI</span>
              </span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-all group-hover:ring-2 group-hover:ring-purple-500/20">
                    <FaUserCircle className="text-lg text-purple-500" />
                    <span>My Profile</span>
                    <FaChevronDown className="text-xs text-gray-400" />
                  </button>
                  {/* Dropdown menu can be added here */}
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-white text-sm font-medium hover:text-purple-400 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
