import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center mt-10">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Sign Up
        </h1>
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
            <input
              id="password"
              name="password"
              type="password"
              {...register("password", { required: true })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
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
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              {...register("confirmPassword", { required: true })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
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
