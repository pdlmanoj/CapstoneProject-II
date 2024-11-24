import React from "react";
import { FaPython, FaDatabase, FaJs, FaNode, FaReact, FaJava, FaDocker, FaAws } from "react-icons/fa";

function SkillsBasedRoadmaps() {
  const skills = [
    {
      name: "Python",
      icon: FaPython,
      description: "Modern Python development from basics to advanced concepts",
      color: "from-blue-500/10 to-green-500/10",
      iconBg: "bg-blue-500"
    },
    {
      name: "SQL",
      icon: FaDatabase,
      description: "Master database design and SQL query optimization",
      color: "from-orange-500/10 to-yellow-500/10",
      iconBg: "bg-orange-500"
    },
    {
      name: "JavaScript",
      icon: FaJs,
      description: "Complete JavaScript programming and web development",
      color: "from-yellow-500/10 to-yellow-600/10",
      iconBg: "bg-yellow-500"
    },
    {
      name: "Node.js",
      icon: FaNode,
      description: "Build scalable backend applications with Node.js",
      color: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500"
    },
    {
      name: "React",
      icon: FaReact,
      description: "Modern React development with hooks and best practices",
      color: "from-cyan-500/10 to-blue-500/10",
      iconBg: "bg-cyan-500"
    },
    {
      name: "Java",
      icon: FaJava,
      description: "Enterprise Java development and Spring framework",
      color: "from-red-500/10 to-orange-500/10",
      iconBg: "bg-red-500"
    },
    {
      name: "Docker",
      icon: FaDocker,
      description: "Container technology and deployment strategies",
      color: "from-blue-600/10 to-blue-400/10",
      iconBg: "bg-blue-600"
    },
    {
      name: "AWS",
      icon: FaAws,
      description: "Cloud computing and AWS services mastery",
      color: "from-orange-600/10 to-yellow-600/10",
      iconBg: "bg-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-900/30">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Skills Based <span className="text-purple-500">Roadmaps</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Master specific technologies with comprehensive learning paths
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {skills.map((skill, index) => (
          <button
            key={index}
            className="bg-gray-800 rounded-xl p-6 text-left transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-xl group relative overflow-hidden"
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`${skill.iconBg} bg-opacity-20 p-3 rounded-lg`}>
                <skill.icon className={`h-6 w-6 ${skill.iconBg} bg-opacity-100`} />
              </div>
              <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {skill.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default SkillsBasedRoadmaps;
