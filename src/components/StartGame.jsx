import React from "react";
import Categories from "./Category";
import CreateTeam from "./CreateTeam"

const GameInstructions = () => {
  return (
    <>
      <section className="py-12 bg-white text-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-pink-600 text-center">
            Game Instructions
          </h1>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-600 text-white font-semibold">
                1
              </div>
              <p className="text-lg">
                <span className="font-bold">Step 1:</span> Select up to 4
                categories.
              </p>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-600 text-white font-semibold">
                2
              </div>
              <p className="text-lg">
                <span className="font-bold">Step 2:</span> Enter Game Name.
              </p>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-600 text-white font-semibold">
                3
              </div>
              <p className="text-lg">
                <span className="font-bold">Step 3:</span> Enter both teams'
                names, and click the "Play" button.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Categories */}
      <Categories />
      {/* Create teams */}
      <CreateTeam/>
    </>
  );
};

export default GameInstructions;
