import React from "react";
import { FaYoutube, FaLinkedin, FaDiscord, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full text-center text-white bg-black-900 py-8 mt-10">
      <hr className="border-t border-gray-700 mb-6" />
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
        Copyright © 2024 brightpathai.io All rights reserved.
      </p>
      <p className="text-sm text-gray-400 mb-4">
        contact:{" "}
        <a href="mailto:support@neetcode.io" className="text-white">
          support@brightpathai.io
        </a>
      </p>
      <div className="flex justify-center gap-4 text-sm text-blue-500">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          Github
        </a>
        <a href="/privacy" className="hover:text-blue-400">
          Privacy
        </a>
        <a href="/terms" className="hover:text-blue-400">
          Terms
        </a>
      </div>
    </footer>
  );
}

export default Footer;
