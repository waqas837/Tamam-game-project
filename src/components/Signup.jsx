import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl } from "../Api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // Use useNavigate to redirect

  // Validate phone number format (simple validation example)
  const validatePhoneNumber = (phone) => {
    const regex = /^[+]?[0-9]{10,15}$/; // Adjust regex as needed
    return regex.test(phone);
  };

  const onSubmit = async (data) => {
    if (!validatePhoneNumber(data.phone)) {
      setErrorMessage("Invalid phone number");
      return;
    }

    setLoading(true); // Show loader
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await axios.post(`${apiUrl}/user/signup`, data);
      console.log(response.data); // Handle the response data as needed

      // Save user information in local storage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      // Redirect to dashboard
      navigate("/start-game");
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-10">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Sign Up
        </h1>
        {loading && <div className="text-center mb-4">Loading...</div>}{" "}
        {/* Loader */}
        {errorMessage && (
          <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
        )}{" "}
        {/* Error message */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              {...register("username", { required: true })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">Username is required</span>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              {...register("email", { required: true })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email is required</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">Password is required</span>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                Please confirm your password
              </span>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <PhoneInput
                country={"us"}
                value={watch("phone")}
                onChange={(phone) => setValue("phone", phone)}
                inputClass="w-full p-3 border border-gray-300 rounded-lg"
                containerClass="w-full"
                buttonClass="bg-gray-200"
              />
            </div>
            {!validatePhoneNumber(watch("phone")) && (
              <span className="text-red-500 text-sm">Invalid phone number</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
