import React, { useState, useEffect } from 'react';

const ResourceSidebar = ({ isOpen, selectedNode, onClose }) => {
  const [resources, setResources] = useState({
    videos: [],
    articles: [],
    books: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedNode) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8000/api/resources/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic: selectedNode.data.label })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch resources');
        }

        setResources(data.resources);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && selectedNode) {
      fetchResources();
    }
  }, [isOpen, selectedNode]);

  if (!isOpen || !selectedNode) return null;

  const ResourceCard = ({ resource }) => (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 mb-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-400">{resource.type}</span>
        <span className="text-xs text-gray-400">{resource.duration}</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{resource.title}</h3>
      <p className="text-sm text-gray-400">{resource.platform}</p>
      {resource.thumbnail && (
        <img 
          src={resource.thumbnail} 
          alt={resource.title}
          className="w-full h-32 object-cover rounded-lg mt-2"
        />
      )}
      {resource.description && (
        <p className="text-sm text-gray-300 mt-2 line-clamp-2">
          {resource.description}
        </p>
      )}
      {resource.channel && (
        <p className="text-xs text-gray-400 mt-1">
          By {resource.channel}
        </p>
      )}
    </a>
  );

  const ResourceSection = ({ title, items }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Resources for {selectedNode.data.label}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
            {error}
          </div>
        ) : (
          <>
            {resources.videos.length > 0 && (
              <ResourceSection title="Video Tutorials" items={resources.videos} />
            )}
            {resources.articles.length > 0 && (
              <ResourceSection title="Articles & Documentation" items={resources.articles} />
            )}
            {resources.books.length > 0 && (
              <ResourceSection title="Books" items={resources.books} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceSidebar;
