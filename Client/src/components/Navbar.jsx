import React, { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-rose-600">Favily</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Services</a>
            <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Solution</a>
            <a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Products</a>
            <button className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700 transition-colors">
              Contact Us
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-rose-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-rose-600 hover:bg-gray-100 transition-colors">Home</a>
            <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-rose-600 hover:bg-gray-100 transition-colors">Services</a>
            <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-rose-600 hover:bg-gray-100 transition-colors">Solution</a>
            <a href="#" className="block px-3 py-2 rounded-md text-gray-600 hover:text-rose-600 hover:bg-gray-100 transition-colors">Products</a>
            <button className="w-full mt-2 bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar