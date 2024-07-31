import React from "react";

const matches = [
  {
    team1: "الفريق A",
    team2: "الفريق B",
    score1: "3",
    score2: "1",
    date: "2024-07-29",
    winner: "الفريق A",
    borderColor: "border-pink-400",
    textColor: "text-gray-800",
    resultColor: "text-green-600",
  },
  {
    team1: "الفريق C",
    team2: "الفريق D",
    score1: "2",
    score2: "2",
    date: "2024-07-28",
    winner: "تعادل",
    borderColor: "border-pink-500",
    textColor: "text-gray-800",
    resultColor: "text-yellow-600",
  },
  {
    team1: "الفريق E",
    team2: "الفريق F",
    score1: "0",
    score2: "4",
    date: "2024-07-27",
    winner: "الفريق F",
    borderColor: "border-pink-600",
    textColor: "text-gray-800",
    resultColor: "text-red-600",
  },
];

const MatchCard = ({
  team1,
  team2,
  score1,
  score2,
  date,
  winner,
  borderColor,
  textColor,
  resultColor,
}) => (
  <div
    className={`w-full max-w-sm ${borderColor} border-2 rounded-lg shadow-lg p-6 m-4 bg-white bg-opacity-40 backdrop-blur-lg backdrop-brightness-90 transition-transform transform hover:scale-105`}
  >
    <div className="flex flex-col items-center text-center">
      <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>
        {team1} ضد {team2}
      </h2>
      <p className={`text-3xl font-bold mb-2 ${textColor}`}>
        {score1} - {score2}
      </p>
      <p className="text-gray-500 mb-4">{date}</p>
      <p className={`text-lg font-semibold ${resultColor}`}>{winner}</p>
    </div>
  </div>
);

const GameShowdown = () => (
  <section className="py-12 bg-gray-100">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-extrabold mb-8 text-pink-600">
        تصادم الألعاب
      </h1>
      <div className="flex flex-wrap justify-center">
        {matches.map((match, index) => (
          <MatchCard
            key={index}
            team1={match.team1}
            team2={match.team2}
            score1={match.score1}
            score2={match.score2}
            date={match.date}
            winner={match.winner}
            borderColor={match.borderColor}
            textColor={match.textColor}
            resultColor={match.resultColor}
          />
        ))}
      </div>
    </div>
  </section>
);

export default GameShowdown;
