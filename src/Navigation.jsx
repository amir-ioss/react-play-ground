import React, { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      {/* Navbar Header */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="text-xl font-bold">MyLogo</div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open menu</span>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-90 z-10 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <a
            href="#home"
            className="text-2xl font-semibold hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="#about"
            className="text-2xl font-semibold hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="#services"
            className="text-2xl font-semibold hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Services
          </a>
          <a
            href="#contact"
            className="text-2xl font-semibold hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 px-4">
        <a href="#home" className="hover:text-gray-400">
          Home
        </a>
        <a href="#about" className="hover:text-gray-400">
          About
        </a>
        <a href="#services" className="hover:text-gray-400">
          Services
        </a>
        <a href="#contact" className="hover:text-gray-400">
          Contact
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
