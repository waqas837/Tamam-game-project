// components/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-pink-500 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="text-pink-500 underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
