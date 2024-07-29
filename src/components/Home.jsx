import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="bottomShape py-16 bg-gradient-to-r from-pink-500 to-purple-500 text-center">
      <div className="items-center ">
        <h1 className="text-4xl font-bold text-white mb-8">
          Welcome to{" "}
          <span className="italic text-yellow-300 font-thin">Tamam</span> - Your
          Ultimate Quiz Experience
        </h1>
        <div className="text-white mb-10">
          <p className="text-lg mb-2">
            Join Tamam and embark on an exciting journey of knowledge and fun.
          </p>
          {/* New text added here */}
          <p className="text-md mb-2">
            Test your skills, challenge your friends, and see who comes out on top!
          </p>
        </div>

        <div className="flex justify-between mx-auto w-96">
          <Link
            to={"/start-game"}
            className="bg-white text-pink-500 font-bold py-2 px-6 rounded-lg shadow-md hover:bg-pink-100 transition duration-300"
          >
           Check All Games
          </Link>

          <Link
            to={"/start-game"}
            className="bg-white text-pink-500 font-bold py-2 px-6 rounded-lg shadow-md hover:bg-pink-100 transition duration-300"
          >
            Start Create Game
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
