import React from 'react';
import RoadmapFlow from '../components/RoadmapFlow';
import { useLocation, useNavigate } from 'react-router-dom';

const RoadmapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roadmapData, prompt } = location.state || {};

  const handleBack = () => {
    navigate('/');
  };

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p>No roadmap data available.</p>
        <button
          onClick={handleBack}
          className="mt-4 px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
      <div className="h-screen w-full">
        <RoadmapFlow roadmapData={roadmapData} prompt={prompt} />
      </div>
    </div>
  );
};

export default RoadmapPage;
