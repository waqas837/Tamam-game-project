// update code
import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, ArrowUpLeft } from "lucide-react";
import { apiUrl } from "../Api";

const SignupModal = ({
  isOpen,
  onClose,
  direction = "rtl",
  title,
  closeHandler,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^[+]?[0-9]{10,15}$/;
    return regex.test(phone);
  };
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
  const onSubmit = async (data) => {
    if (!validatePhoneNumber(data.phone)) {
      setErrorMessage("رقم الهاتف غير صحيح");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(`${apiUrl}/user/signup`, data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("boughtpkg", response.data.user.currentPackage);
      console.log("response.data.success", response.data.success)
      if (response.data.success) {
        closeHandler()
        navigate("/start-game");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "فشل التسجيل");
    } finally {
      setLoading(false);
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex gap-x-3">
            <input
              type="text"
              placeholder="الاسم الأول"
              {...register("firstName", { required: "الاسم الأول مطلوب" })}
              className="w-1/2 px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}

            <input
              type="text"
              placeholder="اسم العائلة"
              {...register("lastName", { required: "اسم العائلة مطلوب" })}
              className="w-1/2 px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            {...register("email", { required: "البريد الإلكتروني مطلوب" })}
            className="w-full px-4 py-2 pl-10 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <PhoneInput
            country={"us"}
            value={watch("phone")}
            inputStyle={{
              width: "100%",
              textAlign: "center",
              borderRadius: 30,
              color: "black",
              padding: 20,
            }}
            onChange={(phone) => setValue("phone", phone)}
            inputClass="w-full p-3 border border-gray-300 rounded-lg"
            containerClass="w-full"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">رقم الهاتف مطلوب</span>
          )}

          {/* Password Input */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              {...register("password", { required: "كلمة المرور مطلوبة" })}
              className="w-full px-4 py-2 pl-10 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {Shield}
            </span>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 left-0 flex items-center pl-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
              {...register("confirmPassword", {
                required: "تأكيد كلمة المرور مطلوب",
                validate: (value) =>
                  value === watch("password") || "كلمتا المرور غير متطابقتين",
              })}
              className="w-full px-4 py-2 pl-10 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {Shield}
            </span>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 left-0 flex items-center pl-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          {/* Error and Submit Button */}
          {errorMessage && (
            <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
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
      </div>
    </div>
  );
};

export default SignupModal;
