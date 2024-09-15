import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, ArrowUpLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming you use React Router
import { apiUrl } from "../Api";
import socket from "../socket";

const LoginModal = ({
  isOpen,
  onClose,
  direction = "rtl",
  title,
  openSignupHandler,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after successful login

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300); // Match this with your transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  let msgIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="16.5"
      viewBox="0 0 22 16.5"
    >
      <g id="envelope" transform="translate(0 -24)">
        <g id="Group_9176" data-name="Group 9176" transform="translate(0 24)">
          <path
            id="Path_1773"
            data-name="Path 1773"
            d="M0,26.75A2.75,2.75,0,0,1,2.75,24h16.5A2.75,2.75,0,0,1,22,26.75v11a2.75,2.75,0,0,1-2.75,2.75H2.75A2.75,2.75,0,0,1,0,37.75Zm2.75-1.375A1.375,1.375,0,0,0,1.375,26.75v.3L11,32.823l9.625-5.775v-.3a1.375,1.375,0,0,0-1.375-1.375Zm17.875,3.277-6.474,3.884,6.474,3.983Zm-.047,9.455-7.755-4.773L11,34.427,9.177,33.333,1.422,38.1a1.375,1.375,0,0,0,1.328,1.02h16.5a1.375,1.375,0,0,0,1.328-1.019Zm-19.2-1.587,6.474-3.983L1.375,28.652Z"
            transform="translate(0 -24)"
            fill="#d140c8"
          />
        </g>
      </g>
    </svg>
  );
  let Shield = (
    <svg
      id="Group_9179"
      data-name="Group 9179"
      xmlns="http://www.w3.org/2000/svg"
      width="20.5"
      height="23.429"
      viewBox="0 0 20.5 23.429"
    >
      <path
        id="Path_1776"
        data-name="Path 1776"
        d="M18.352,2.328Q16.26,2.9,14.2,3.582a.7.7,0,0,0-.48.571,17.67,17.67,0,0,0,3.3,13.454,15.7,15.7,0,0,0,3.349,3.27,8.9,8.9,0,0,0,1.308.78,3.255,3.255,0,0,0,.429.173.805.805,0,0,0,.148.037.9.9,0,0,0,.146-.037,3.183,3.183,0,0,0,.43-.173,9.109,9.109,0,0,0,1.308-.78,15.706,15.706,0,0,0,3.349-3.27,17.668,17.668,0,0,0,3.3-13.454.7.7,0,0,0-.48-.571c-.953-.312-2.562-.82-4.154-1.252a19.045,19.045,0,0,0-3.9-.767,19.063,19.063,0,0,0-3.9.767ZM17.963.82A19.934,19.934,0,0,1,22.25,0a19.934,19.934,0,0,1,4.287.82c1.625.439,3.264.959,4.227,1.274a2.255,2.255,0,0,1,1.529,1.848A19.261,19.261,0,0,1,28.684,18.57,17.242,17.242,0,0,1,25,22.162a10.483,10.483,0,0,1-1.535.915,3.106,3.106,0,0,1-1.214.351,3.113,3.113,0,0,1-1.214-.351,10.481,10.481,0,0,1-1.535-.915,17.245,17.245,0,0,1-3.686-3.592A19.261,19.261,0,0,1,12.206,3.942a2.255,2.255,0,0,1,1.529-1.848q2.1-.688,4.227-1.274Z"
        transform="translate(-12)"
        fill="#d140c8"
      />
      <path
        id="Path_1777"
        data-name="Path 1777"
        d="M82.39,62.2a2.2,2.2,0,0,1-1.464,2.072l.564,2.914a.732.732,0,0,1-.719.871H79.617a.732.732,0,0,1-.717-.871l.562-2.914A2.2,2.2,0,1,1,82.39,62.2Z"
        transform="translate(-69.944 -52.686)"
        fill="#d140c8"
      />
    </svg>
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        socket.connect();
        socket.emit("saveConnUserId", { userId: data.user._id });
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("boughtpkg", data.user.currentPackage);
        navigate("/start-game");
        onClose(); // Close modal on successful login
      } else {
        setError(
          data.message ||
            "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقًا.");
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen
            ? "bg-opacity-50 backdrop-blur-sm"
            : "bg-opacity-0 backdrop-blur-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`relative bg-white rounded-lg p-6 m-4 max-w-xl w-full shadow-xl transition-all duration-300 ${
          direction === "rtl" ? "rtl" : "ltr"
        } ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        dir={direction}
      >
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-2xl text-black">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 ring-yellow-400 focus:ring-yel-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {msgIcon}
            </span>
          </div>

          {/* Password Input */}
          <div className="relative">
            <span
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full px-4 py-2 pl-10 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {Shield}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <button
            type="submit"
            className="m-auto group relative flex items-center justify-between bg-yellow-400 text-black px-10 py-3 rounded-full focus:ring-4 ring-yellow-300"
          >
            <p className="text-sm ml-2">تسجيل</p>
            <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
              <ArrowUpLeft size={12} />
            </p>
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => openSignupHandler(true)}
            className="text-sm underline text-black"
          >
            ليس لدي حساب
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
