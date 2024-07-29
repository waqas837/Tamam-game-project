import React from "react";
import "./Home.css";
const Home = () => {
  return (
    <div className="bottomShape min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 text-center">
      <h1 className="text-4xl font-bold text-pink-100 mb-4">
        Welcome to <span className="italic text-white font-thin">Tamam</span>{" "}
        the Question-Answer
      </h1>
      <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-4 focus:ring ring-pink-500">
        Start Game
      </button>
      <div className="border border-pink-200 text-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">How to Play</h2>
        <p className="text-lg">1. Click the "Start Game" button.</p>
        <p className="text-lg">2. Answer the questions as they appear.</p>
        <p className="text-lg">3. Try to get the highest score!</p>
      </div>
    </div>
  );
};

export default Home;
