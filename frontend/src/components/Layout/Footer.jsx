import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="hidden sm:flex w-full bg-white bg-opacity-60 border rounded-2xl shadow-md border-transparent bg-clip-padding backdrop-blur-md 
    px-4 mt-5 flex-col justify-center items-center py-3">
      <p className="text-sm md:text-base text-gray-700 text-center mb-1">
        &copy; <span className="font-semibold text-[#1E3A8A]">Bluverse </span>. All Rights Reserved.
      </p>

      <div className="text-sm flex gap-2">
        <a
          href="https://www.sknscoe.ac.in/"
          className="text-[#4285F4] hover:text-[#0b66c3] no-underline transition-colors duration-200 font-medium"
          style={{ textDecoration: 'none' }}
        >
          About
        </a>
        |
        <Link
          to="/contact"
          className="text-[#EA4335] hover:text-[#c5221f] no-underline transition-colors duration-200 font-medium"
          style={{ textDecoration: 'none' }}
        >
          Contact
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
