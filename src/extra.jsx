import React from "react";
import { FaPlay, FaClock, FaChalkboardTeacher } from "react-icons/fa";

function Videos() {
  const videos = [
    {
      title: "The Ultimate Frontend Developer Roadmap",
      description: "Complete guide to becoming a frontend developer in 2024",
      duration: "10 Minutes",
      views: "15K",
      instructor: "Sarah Johnson",
      link: "/frontend-roadmap",
      thumbnail: "https://img.youtube.com/vi/frontend123/maxresdefault.jpg"
    },
    {
      title: "Session Based Authentication",
      description: "Learn modern authentication techniques for web applications",
      duration: "2 Minutes",
      views: "8K",
      instructor: "Mike Chen",
      link: "/session-authentication",
      thumbnail: "https://img.youtube.com/vi/auth456/maxresdefault.jpg"
    },
    {
      title: "Basic Authentication",
      description: "Understanding the fundamentals of user authentication",
      duration: "5 Minutes",
      views: "12K",
      instructor: "Emily Davis",
      link: "/basic-authentication",
      thumbnail: "https://img.youtube.com/vi/basic789/maxresdefault.jpg"
    },
    {
      title: "Basics of Authentication",
      description: "Step-by-step guide to implementing user authentication",
      duration: "5 Minutes",
      views: "10K",
      instructor: "David Wilson",
      link: "/basics-authentication",
      thumbnail: "https://img.youtube.com/vi/basics101/maxresdefault.jpg"
    },
    {
      title: "Graph Data Structure",
      description: "Master graph algorithms and implementations",
      duration: "13 Minutes",
      views: "20K",
      instructor: "Alex Thompson",
      link: "/graph-data-structure",
      thumbnail: "https://img.youtube.com/vi/graph202/maxresdefault.jpg"
    },
    {
      title: "Heap Data Structure",
      description: "Deep dive into heap data structure and its applications",
      duration: "8 Minutes",
      views: "18K",
      instructor: "Rachel Kim",
      link: "/heap-data-structure",
      thumbnail: "https://img.youtube.com/vi/heap303/maxresdefault.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-900/30">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Featured <span className="text-purple-500">Videos</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Learn from our curated collection of educational videos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {videos.map((video, index) => (
          <a
            href={video.link}
            key={index}
            className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:opacity-75 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaPlay className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {video.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChalkboardTeacher className="w-4 h-4" />
                  <span>{video.instructor}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Videos;
