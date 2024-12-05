import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerk, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Header = () => {
  const { signOut } = useClerk();
  const location = useLocation();

  return (
    <header className="bg-neutral-900 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              BrightPath <span className="text-purple-500">AI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link to="/dashboard" className={`text-gray-300 hover:text-white px-3 py-2 ${location.pathname === '/dashboard' ? 'bg-purple-600 text-white' : ''}`}>
                Dashboard
              </Link>
              <Link to="/roadmap" className={`text-gray-300 hover:text-white px-3 py-2 ${location.pathname === '/roadmap' ? 'bg-purple-600 text-white' : ''}`}>
                Roadmaps
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md transition-colors ${
                  location.pathname === '/login'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-2 rounded-md transition-colors ${
                  location.pathname === '/signup'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 border border-purple-600 hover:bg-purple-600 hover:text-white'
                }`}
              >
                Sign up
              </Link>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
