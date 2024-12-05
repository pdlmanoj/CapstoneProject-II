import React from "react";
import { FaYoutube, FaLinkedin, FaDiscord, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full text-center text-white bg-neutral-900 py-8">
      <hr className="border-t border-neutral-800 mb-6" />
      <div className="flex justify-center gap-6 mb-4 text-2xl text-gray-400">
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="hover:text-red-500 transition-colors duration-200"
        >
          <FaYoutube />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-blue-500 transition-colors duration-200"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          className="hover:text-indigo-500 transition-colors duration-200"
        >
          <FaDiscord />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="hover:text-sky-400 transition-colors duration-200"
        >
          <FaTwitter />
        </a>
      </div>
      <p className="text-sm text-gray-400 mb-1">
        Copyright 2024 brightpathai.io All rights reserved.
      </p>
      <p className="text-sm text-gray-400 mb-4">
        contact:{" "}
        <a href="mailto:support@brightpathai.io" className="text-purple-400 hover:text-purple-300">
          support@brightpathai.io
        </a>
      </p>
      <div className="flex justify-center gap-4 text-sm text-gray-400">
        <a href="/privacy" className="hover:text-purple-400">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="/terms" className="hover:text-purple-400">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}

export default Footer;
