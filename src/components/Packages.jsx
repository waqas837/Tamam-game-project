import React from "react";
import { Link } from "react-router-dom";
 
const Packages = () => {
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
          <p className="text-lg mb-2">
            Test your skills, challenge your friends, and see who comes out on top!
          </p>
        </div>

        <div className="flex justify-between mx-auto w-96 mb-12">
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
        
        {/* New section for packages */}
        <div className="package-section py-16 bg-gray-100 text-center">
          <h2 className="text-3xl font-bold mb-8 text-pink-500">Game Packages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mx-auto max-w-4xl">
            <div className="package-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">1 Game</h3>
              <p className="text-lg mb-4">Price: £2</p>
              <Link
                to={"/buy-game/1"}
                className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
              >
                Buy Now
              </Link>
            </div>
            
            <div className="package-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">3 Games</h3>
              <p className="text-lg mb-4">Price: £4</p>
              <Link
                to={"/buy-game/3"}
                className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
              >
                Buy Now
              </Link>
            </div>
            
            <div className="package-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">5 Games</h3>
              <p className="text-lg mb-4">Price: £7</p>
              <Link
                to={"/buy-game/5"}
                className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
              >
                Buy Now
              </Link>
            </div>
            
            <div className="package-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">8 Games</h3>
              <p className="text-lg mb-4">Price: £10</p>
              <Link
                to={"/buy-game/8"}
                className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
