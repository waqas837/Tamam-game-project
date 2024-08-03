import React, { useState } from "react";
import "./Navbar.css"; // Import the custom CSS for the ripple effect

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className="shadow-md text-pink-500"
      style={{
        backgroundImage: 'url("pink.png")',
        backgroundSize: "100vw",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 ml-6">
            <a href="/" className="text-xl font-bold text-navy-900">
             <img src="logo.png" width={100} height={100} alt="logo.png" />
            </a>
          </div>

          {/* Links Section */}
          <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <a
              href="/find-packages"
              className="relative text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
              تصفح الباقات
            </a>
            <a
              href="/login"
              className="relative text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
              تسجيل الدخول
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="-ml-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-navy-400 hover:text-navy-900 hover:bg-pink-100 focus:outline-none focus:bg-pink-100 focus:text-navy-900"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Links */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/login"
            className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
          >
            تسجيل الدخول
          </a>
          <a
            href="/find-packages"
            className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
          >
            تصفح الباقات
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
