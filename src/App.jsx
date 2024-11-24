import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoginPage from "./LoginPage";
import BrightPathAI from "./BrightPathAI";
import SignupPage from "./SignupPage";
import Dashboard from "./Dashboard";
import RoadmapPage from "./pages/RoadmapPage";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
      </Routes>
      
    </Router>
  );
}

export default App;
