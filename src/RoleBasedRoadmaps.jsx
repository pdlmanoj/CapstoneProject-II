import React from "react";
import { FaCode, FaDatabase, FaServer, FaChartBar, FaCloud, FaCogs } from "react-icons/fa";

function RoleBasedRoadmaps() {
  const roles = [
    {
      name: "Frontend Developer",
      icon: FaCode,
      description: "Build beautiful user interfaces and modern web applications"
    },
    {
      name: "Full Stack Developer",
      icon: FaCogs,
      description: "Master both frontend and backend development"
    },
    {
      name: "Backend Developer",
      icon: FaServer,
      description: "Create robust server-side applications and APIs"
    },
    {
      name: "Data Analyst",
      icon: FaChartBar,
      description: "Analyze data and create meaningful insights"
    },
    {
      name: "DevOps Engineer",
      icon: FaCloud,
      description: "Streamline development operations and deployment"
    },
    {
      name: "Data Engineer",
      icon: FaDatabase,
      description: "Build and maintain data processing systems"
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Role Based <span className="text-purple-500">Roadmaps</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Choose your career path and follow a structured roadmap created by industry experts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {roles.map((role, index) => (
          <button
            key={index}
            className="bg-gray-800 rounded-xl p-6 text-left transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-xl group relative overflow-hidden"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                <role.icon className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">{role.name}</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {role.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default RoleBasedRoadmaps;
