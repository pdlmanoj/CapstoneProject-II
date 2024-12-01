import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import { FaBook, FaRocket, FaBrain, FaChartLine, FaClock, FaTrophy, FaDatabase, FaRobot, FaShieldAlt, FaCubes, FaCloud, FaMobile, FaGamepad, FaCode, FaSearch } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdown.css';
import RoadmapFlow from './components/RoadmapFlow';

function Dashboard() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const popularRoadmaps = [
    { 
      icon: FaDatabase, 
      title: "Data Science", 
      description: "Learn data analysis, visualization, and machine learning" 
    },
    { 
      icon: FaRobot, 
      title: "Machine Learning", 
      description: "Master AI algorithms and neural networks" 
    },
    { 
      icon: FaShieldAlt, 
      title: "Cyber Security", 
      description: "Explore security principles and best practices" 
    },
    { 
      icon: FaCubes, 
      title: "Blockchain", 
      description: "Understand blockchain technology and smart contracts" 
    },
    { 
      icon: FaCloud, 
      title: "Cloud Computing", 
      description: "Learn cloud services and deployment strategies" 
    },
    { 
      icon: FaMobile, 
      title: "Mobile Development", 
      description: "Build iOS and Android applications" 
    },
    { 
      icon: FaGamepad, 
      title: "Game Development", 
      description: "Create engaging games and interactive experiences" 
    },
    { 
      icon: FaCode, 
      title: "Full Stack Development", 
      description: "Master both frontend and backend development" 
    }
  ];

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", "true");
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }
      
      if (!data.success) {
        setError(data.error || 'Failed to generate roadmap');
        return;
      }
      
      const roadmapData = parseRoadmapToStructure(data.roadmap);
      // Navigate to roadmap page with data
      navigate('/roadmap', { 
        state: { 
          roadmapData,
          prompt: prompt.trim()
        }
      });
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(error.message || 'Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseRoadmapToStructure = (roadmapData) => {
    try {
      // If roadmapData is already in the correct format (from Gemini API)
      if (roadmapData && roadmapData.title && roadmapData.subtopics) {
        return roadmapData;
      }

      // If it's a string (from local model), parse it as before
      if (typeof roadmapData === 'string') {
        const lines = roadmapData.split('\n');
        let roadmapStructure = {
          title: prompt.trim().toUpperCase(),
          subtopics: []
        };

        let currentSubtopic = null;
        let isFirstLine = true;

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;

          // Skip the first line since we're using the prompt as title
          if (isFirstLine) {
            isFirstLine = false;
            continue;
          }

          // Check for numbered sections (e.g., "1. Introduction to CV", "2. Image Processing")
          const sectionMatch = cleanLine.match(/^(\d+\.)\s*(.*?)(?:\s*\(.*\))?$/);
          if (sectionMatch) {
            currentSubtopic = {
              title: sectionMatch[2].trim(),
              children: []
            };
            roadmapStructure.subtopics.push(currentSubtopic);
            continue;
          }

          // Skip subsection numbers (e.g., "1.1", "2.1")
          if (/^\d+\.\d+/.test(cleanLine)) {
            continue;
          }

          // Add other lines as children to current subtopic
          if (currentSubtopic && 
              !cleanLine.includes('hours)') && 
              !cleanLine.includes('hour)') &&
              !cleanLine.match(/^\d+\./)) {
            currentSubtopic.children.push({
              title: cleanLine
            });
          }
        }

        return roadmapStructure;
      }

      console.error('Invalid roadmap data format');
      return null;
    } catch (error) {
      console.error('Error parsing roadmap:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col pt-20">
      <Header />
      
      <main className="flex-grow p-6 md:p-10">
        {/* Popular Among Others Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Popular Among <span className="text-purple-500">Others</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoadmaps.map((roadmap, index) => (
              <button
                key={index}
                className="bg-gray-800 rounded-xl p-6 text-left transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-xl group relative overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                    <roadmap.icon className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{roadmap.title}</h3>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {roadmap.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Generate Custom Roadmap Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            What Do You Want To <span className="text-purple-500">Learn Today</span>?
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter field name you want to learn, 
For example:
  • Data Science
  • UI/UX Designer
  • Full Stack Developement"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <FaSearch className="absolute right-4 top-4 text-gray-400" />
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h3 className="text-purple-400 font-medium mb-2">Note:</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Please enter only the field name (e.g., "Data Science")</li>
                    <li>• Do not include phrases like "I want to learn" or "Create roadmap for"</li>
                    <li>• Keep it simple and specific to get the best results</li>
                  </ul>
                </div>
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={!prompt.trim() || isGenerating}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    !prompt.trim() || isGenerating
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Roadmap...
                    </span>
                  ) : (
                    'Generate Roadmap'
                  )}
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Our trained machine learning model will generate a structured roadmap based on your selected field. Simply enter the field name to get started.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
              {error}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default Dashboard;
