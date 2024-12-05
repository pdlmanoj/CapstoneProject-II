import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import Header from "./Header";
import Footer from "./Footer";
import LoginPage from "./LoginPage";
import BrightPathAI from "./BrightPathAI";
import SignupPage from "./SignupPage";
import Dashboard from "./Dashboard";
import RoadmapPage from "./pages/RoadmapPage";

// Wrapper component to handle conditional footer rendering
const AppContent = () => {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useUser();
  const showFooter = location.pathname !== '/roadmap';
  const showHeader = location.pathname !== '/roadmap';

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isLoaded) {
      return null;
    }
    
    if (!isSignedIn) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950">
      {showHeader && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<BrightPathAI />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
