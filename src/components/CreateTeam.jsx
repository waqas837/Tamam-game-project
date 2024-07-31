import React, { useState } from "react";

const CreateGameForm = () => {
  const [gameName, setGameName] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Game Name:", gameName);
    console.log("Team 1:", team1);
    console.log("Team 2:", team2);
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-pink-600 text-center">
          Create Team
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="gameName"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Enter Game Name
            </label>
            <input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="team1"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Enter Team 1 Name
            </label>
            <input
              id="team1"
              type="text"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="team2"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Enter Team 2 Name
            </label>
            <input
              id="team2"
              type="text"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Play
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateGameForm;
