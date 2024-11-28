import React, { useState, useEffect } from 'react';

const ResourceSidebar = ({ isOpen, selectedNode, onClose }) => {
  const [resources, setResources] = useState({
    topicInfo: '',
    courses: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedNode || !selectedNode.data) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get the clean topic name from the node label
        const cleanTopic = selectedNode.data.label.replace(/^\d+(\.\d+)*\s*/, '').trim();
        console.log('Fetching resources for topic:', cleanTopic);

        const response = await fetch('http://localhost:8000/api/resources/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic: cleanTopic })
        });

        const data = await response.json();
        console.log('Resource API response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch resources');
        }

        if (data.success && data.resources) {
          console.log('Setting resources:', data.resources);
          setResources(data.resources);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch resources whenever the selectedNode changes or sidebar opens
    if (isOpen && selectedNode) {
      fetchResources();
    }
  }, [isOpen, selectedNode]);  // Added selectedNode as dependency

  // Clear resources when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setResources({
        topicInfo: '',
        courses: []
      });
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !selectedNode) return null;

  // Get clean topic name without numbering
  const cleanTopic = selectedNode.data.label.replace(/^\d+(\.\d+)*\s*/, '').trim();

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-xl overflow-y-auto z-50">
      <div className="p-6 relative">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-gray-900 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Resources</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="space-y-8">
            {/* Topic Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-3">What is {cleanTopic}?</h2>
              <p className="text-gray-300 leading-relaxed">{resources.topicInfo || 'No information available for this topic.'}</p>
            </div>

            {/* Courses */}
            {resources.courses && resources.courses.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Recommended Courses</h2>
                <div className="space-y-4">
                  {resources.courses.map((course, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                        <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded">
                          {course.platform}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">Instructor: {course.instructor}</p>
                      <p className="text-sm text-gray-300 mb-3">{course.description}</p>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Course
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceSidebar;
