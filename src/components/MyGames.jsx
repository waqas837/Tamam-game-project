import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Card = ({ children, className }) => (
  <div
    className={`bg-gradient-to-br from-pink-50 to-white shadow-lg rounded-lg overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div
    className={`bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 p-6 mb-4 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const GameCard = () => (
  <Card className="w-full max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
    <CardHeader>
      <CardTitle>The Witcher 3</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4">
        {["RPG", "Open World", "Fantasy", "Action", "Story", "Adventure"].map(
          (category, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={`/api/placeholder/80/80?text=${category}`}
                alt={category}
                className="w-20 h-20 rounded-lg shadow-md border-2 border-pink-200 transition-all duration-300 hover:scale-110"
              />
              <span className="mt-2 text-xs text-center text-pink-700">
                {category}
              </span>
            </div>
          )
        )}
      </div>
    </CardContent>
  </Card>
);

const GameCategoriesPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-8">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-12 shadow-text">
        My Games
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <GameCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default GameCategoriesPage;
