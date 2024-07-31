import React, { useState } from "react";

const CreateGameForm = () => {
  const [gameName, setGameName] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!gameName || !team1 || !team2) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    setError(""); // Clear error message
    setLoading(true); // Set loading state

    // Simulate form submission
    setTimeout(() => {
      console.log("اسم اللعبة:", gameName);
      console.log("فريق 1:", team1);
      console.log("فريق 2:", team2);
      
      // Reset form and loading state
      setGameName("");
      setTeam1("");
      setTeam2("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-pink-600 text-center">
          أنشئ فريق
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200"
        >
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <div className="mb-6">
            <label
              htmlFor="gameName"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              أدخل اسم اللعبة
            </label>
            <input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="اسم اللعبة"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="team1"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              أدخل اسم الفريق 1
            </label>
            <input
              id="team1"
              type="text"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="اسم الفريق 1"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="team2"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              أدخل اسم الفريق 2
            </label>
            <input
              id="team2"
              type="text"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="اسم الفريق 2"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md shadow text-white ${
              loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
            } focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all`}
            disabled={loading}
          >
            {loading ? "جارٍ التحميل..." : "اللعب"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateGameForm;
