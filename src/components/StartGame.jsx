import React, { useRef } from "react";
import "./Home.css";
import Category from "./Category";
import CreateTeam from "./CreateTeam";

const StartGame = () => {
  const catRef = useRef();
  return (
    <div>
      <div className="bottomShape flex flex-col justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 text-center mb-28">
        <div className=" p-6">
          <div className="border border-pink-200 text-white p-6 rounded-lg mb-8">
            <h2 className="text-3xl font-bold mb-4">How to Play</h2>
            <p className="text-lg mb-2">1. Click the "Start Game" button.</p>
            <p className="text-lg mb-2">
              2. Select the categories that you want.
            </p>
            <p className="text-lg mb-2">3. Select and Name your teams.</p>
          </div>
          <button
            onClick={() =>
              catRef.current.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-pink-500 font-bold py-2 px-6 rounded-lg shadow-md hover:bg-pink-100 transition duration-300"
          >
            Play!
          </button>
        </div>
      </div>
      {/* categories */}
      <div ref={catRef} id="category">
        <Category />
      </div>
      {/* create team */}
      <CreateTeam/>
    </div>
  );
};

export default StartGame;
