import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the custom CSS for the ripple effect
import toast, { Toaster } from "react-hot-toast";
import LoginModal from "./LoginModal";
import SignupModel from "./SignupModel";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [direction, setDirection] = useState("rtl");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenSIGNUP, setIsModalOpenSIGNUP] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const openSignupHandler = (boolen) => {
    if (boolen) {
      // close login modal
      setIsModalOpen(false);
      // open the signup model
      setIsModalOpenSIGNUP(true);
    }
  };
  let lockicon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 33 33"
    >
      <g id="Group_8999" data-name="Group 8999" transform="translate(0 -1)">
        <rect
          id="Rectangle_17815"
          data-name="Rectangle 17815"
          width="33"
          height="33"
          rx="16.5"
          transform="translate(0 1)"
          fill="#232323"
        />
        <g id="lock-on_curved" transform="translate(-30 -15.143)">
          <path
            id="Path_1661"
            data-name="Path 1661"
            d="M50.476,31.076V27.81a3.81,3.81,0,0,0-7.619,0v3.266m7.619,0a13.688,13.688,0,0,0-3.81-.409,13.689,13.689,0,0,0-3.81.409m7.619,0c2.117.634,2.857,2.077,2.857,4.829,0,4.006-1.569,5.238-6.667,5.238S40,39.91,40,35.9c0-2.752.74-4.2,2.857-4.829"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
          />
          <rect
            id="Rectangle_17850"
            data-name="Rectangle 17850"
            width="2"
            height="4"
            rx="1"
            transform="translate(46 34.143)"
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  );

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
    navigate("/");
  };

  return (
    <nav className=" text-pink-500">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 ml-6">
            <Link to="/" className="text-xl font-bold text-navy-900">
              <img src="logo.png" width={100} height={100} alt="logo.png" />
            </Link>
          </div>
          {/* Login and Signup Modals */}
          <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            direction={direction}
            title="تسجيل الدخول"
            openSignupHandler={openSignupHandler}
          />

          <SignupModel
            isOpen={isModalOpenSIGNUP}
            onClose={() => setIsModalOpenSIGNUP(false)}
            direction={direction}
            title="حساب جديد"
            openSignupHandler={openSignupHandler}
            closeHandler={() => setIsModalOpenSIGNUP(false)}
          />
          {/* Links Section */}
          <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <div className="flex justify-between items-center gap-5">
              <Link to="/start-game">ألعب</Link> <Link to="/">قصتنا</Link>{" "}
              {/* <Link to="/">تواصل معنا</Link> */}
            </div>
            {/* Conditionally render "My Games" link if logged in */}
            {user && (
              <>
                <Link
                  to="/my-games"
                  className="group relative flex items-center justify-between border text-black px-24 py-6 rounded-full"
                >
                  <p className="absolute left-12"> عدد الألعاب المتبقية:</p>
                  <p className="absolute left-3 text-[25px] text-[#D140C8] rounded-full font-bold p-1">
                    {user ? user.remainingGames : "0"}
                  </p>
                </Link>
              </>
            )}
            {/* Modal */}

            {/* Conditionally render Login link */}
            {!user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-6 rounded-full focus:ring-4 ring-yellow-300"
              >
                <p className="absolute left-20"> تسجيل الدخول</p>
                <p className="absolute left-1 bg-black rounded-full text-white p-1">
                  {lockicon}
                </p>
              </button>
            )}
            {/* <Link
              to={"/#pkgs"}
              className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
              تصفح الباقات
            </Link> */}

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
          {/* <Link
            to={"/#pkgs"}
            className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
          >
            تصفح الباقات
          </Link> */}

          {/* Conditionally render "My Games" link if logged in */}
          {user && (
            <button
              onClick={() => navigate("/my-games")}
              className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
            >
              لوحة التحكم
            </button>
          )}

          {/* Conditionally render Login link */}
          {!user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent ripple-effect"
            >
              تسجيل الدخول
            </button>
          )}

          {/* Display User Info in Mobile Menu */}
          {user && (
            <div className="pt-2 w-full">
              <span className="block text-navy-700">{user.username}</span>
              <button
                onClick={handleLogout}
                className="relative block text-navy-700 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-navy-900 hover:bg-pink-100 border border-transparent hover:border-pink-700 ripple-effect"
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
