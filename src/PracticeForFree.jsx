import React from "react";
import { FaCode, FaDiscord, FaRocket, FaUserFriends, FaBook, FaTrophy } from "react-icons/fa";

function PracticeForFree() {
  const features = [
    {
      icon: FaCode,
      title: "Curated Study Plans",
      description: "Follow organized roadmaps including Blind 75 and Neetcode 150"
    },
    {
      icon: FaBook,
      title: "Video Explanations",
      description: "Detailed video solutions for every coding problem"
    },
    {
      icon: FaDiscord,
      title: "Active Community",
      description: "Join our Discord community with over 30,000 members"
    },
    {
      icon: FaUserFriends,
      title: "Progress Tracking",
      description: "Sign in to save your progress and track improvements"
    },
    {
      icon: FaRocket,
      title: "Regular Updates",
      description: "New problems and solutions added regularly"
    },
    {
      icon: FaTrophy,
      title: "Achievement System",
      description: "Earn badges and track your learning milestones"
    }
  ];

  const actions = [
    {
      text: "Start Practicing",
      color: "bg-purple-600 hover:bg-purple-700",
      icon: FaCode
    },
    {
      text: "View Roadmap",
      color: "bg-pink-600 hover:bg-pink-700",
      icon: FaRocket
    },
    {
      text: "Join Discord",
      color: "bg-indigo-600 hover:bg-indigo-700",
      icon: FaDiscord
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Practice for <span className="text-purple-500">Free</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The best free resources for Coding Interviews. Period.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-800"
            >
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 ${action.color} hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className="w-5 h-5" />
              {action.text}
            </button>
          ))}
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400">
            <FaRocket className="w-4 h-4" />
            Much more coming soon!
          </span>
        </div>
      </div>
    </section>
  );
}

export default PracticeForFree;
