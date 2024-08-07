import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/add-question");
  }, []);

  const navItems = [
    { name: "Add Question", path: "/admin/add-question" },
    { name: "Question List", path: "/admin/question-list" },
  ];
  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white flex justify-between items-center px-4 z-50">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-pink-500 to-purple-500 text-white shadow-lg z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center h-16 bg-opacity-50 bg-purple-600">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-8">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block py-4 px-6 hover:bg-pink-600 transition-colors duration-200 ${
                    location.pathname === item.path && "bg-pink-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 py-2 px-4 rounded-lg text-white hover:bg-purple-700 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
