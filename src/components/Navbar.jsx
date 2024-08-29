import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the custom CSS for the ripple effect

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Handle user data from localStorage
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setUser(null);
      }
    }

    // Handle scrolling to section if hash is present in URL
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && location.pathname === "/") {
        // Ensure it's the home page
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Execute scroll handling if hash is present
    handleHashScroll();
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("boughtpkg");
    localStorage.removeItem("pkgId");
    localStorage.removeItem("pckgName");
    localStorage.removeItem("price");
    setUser(null);
    navigate("/login");
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
            <Link to="/" className="text-xl font-bold text-navy-900">
              <img src="logo.png" width={100} height={100} alt="logo.png" />
            </Link>
          </div>

          {/* Links Section */}
          <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <Link
              to={"/#pkgs"}
              className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
              تصفح الباقات
            </Link>

            {/* Conditionally render "My Games" link if logged in */}
            {user && (
              <Link
                to="/my-games"
                className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
              >
               لوحة التحكم
              </Link>
            )}

            {/* Conditionally render Login link */}
            {!user && (
              <Link
                to="/login"
                className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
              >
                تسجيل الدخول
              </Link>
            )}

            {/* Display User Info if logged in */}
            {user && (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span className="text-navy-700">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-pink-600 hover:text-pink-800"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
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
          <Link
            to={"/#pkgs"}
            className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
          >
            تصفح الباقات
          </Link>

          {/* Conditionally render "My Games" link if logged in */}
          {user && (
            <Link
              to="/my-games"
              className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
               لوحة التحكم
            </Link>
          )}

          {/* Conditionally render Login link */}
          {!user && (
            <Link
              to="/login"
              className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
              تسجيل الدخول
            </Link>
          )}

          {/* Display User Info in Mobile Menu */}
          {user && (
            <div className="pt-2">
              <span className="block text-navy-700">{user.username}</span>
              <button
                onClick={handleLogout}
                className="block mt-2 text-pink-600 hover:text-pink-800"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
