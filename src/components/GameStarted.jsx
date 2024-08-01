import React, { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";

// Component to display team scores
const TeamScore = ({ team, score }) => (
  <div className="text-white text-2xl font-bold">
    Team {team}: {score} Points
  </div>
);

const GameInterface = () => {
  const [currentStep, setCurrentStep] = useState("questions");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [viewAnswer, setViewAnswer] = useState(false);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [currentTeam, setCurrentTeam] = useState("team1");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // List of questions for each team
  const team1Questions = [
    {
      points: 200,
      question: "What is the capital of Pakistan?",
      answer: "Islamabad",
      img: "question1.png",
    },
    {
      points: 400,
      question: "Who wrote Hamlet?",
      answer: "William Shakespeare",
      img: "question2.png",
    },
    {
      points: 600,
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter",
      img: "question3.png",
    },
    {
      points: 800,
      question: "What is the hardest natural substance on Earth?",
      answer: "Diamond",
      img: "question7.png",
    },
    {
      points: 1000,
      question: "In which year did the Titanic sink?",
      answer: "1912",
      img: "question8.png",
    },
  ];
  
  const team2Questions = [
    {
      points: 200,
      question: "What is the largest country in the world?",
      answer: "Russia",
      img: "question4.png",
    },
    {
      points: 400,
      question: "Who painted the Mona Lisa?",
      answer: "Leonardo da Vinci",
      img: "question5.png",
    },
    {
      points: 600,
      question: "What is the tallest mountain in the world?",
      answer: "Mount Everest",
      img: "question6.png",
    },
    {
      points: 800,
      question: "What is the chemical symbol for Gold?",
      answer: "Au",
      img: "question9.png",
    },
    {
      points: 1000,
      question: "Which planet is known as the Red Planet?",
      answer: "Mars",
      img: "question10.png",
    },
  ];
  
  // Handle clicking a point button
  const handlePointsClick = (question, points) => {
    setSelectedQuestion(question);
    setSelectedPoints(points);
    setViewAnswer(false);
    setModalIsOpen(true);
  };

  // Handle viewing the answer
  const handleViewAnswer = () => setViewAnswer(true);

  // Handle marking the answer as correct and updating the score
  const handleCorrectAnswer = (team) => {
    if (team === "team1") {
      setTeam1Score((prevScore) => prevScore + selectedPoints);
    } else if (team === "team2") {
      setTeam2Score((prevScore) => prevScore + selectedPoints);
    }
    setModalIsOpen(false);
    setSelectedQuestion(null);
    setSelectedPoints(0); // Reset selected points
    setCurrentTeam(team === "team1" ? "team2" : "team1");
  };

  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    setCurrentStep("gameOver");
  };

  // Determine the winner
  const getWinner = () => {
    if (team1Score > team2Score) return "Team 1";
    if (team2Score > team1Score) return "Team 2";
    return "No one, it's a tie!";
  };

  // Get questions for the current team
  const getQuestionsForCurrentTeam = () => {
    return currentTeam === "team1" ? team1Questions : team2Questions;
  };

  // Find the selected question object
  const findSelectedQuestion = () => {
    return getQuestionsForCurrentTeam().find(
      (q) => q.question === selectedQuestion
    );
  };

  // Ensure Modal component is connected to the app element for accessibility
  Modal.setAppElement("#root");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-8 flex flex-col">
      {!gameOver && (
        <>
          <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-6">
            <TeamScore team="1" score={team1Score} />
            <TeamScore team="2" score={team2Score} />
          </div>

          <div className="flex-grow flex flex-col md:flex-row">
            {/* Team 1 Questions */}
            <div className="flex-1 p-4">
              <h2 className="text-2xl text-white mb-4 text-center">
                Team 1 Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team1Questions.map((q, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-md overflow-hidden p-4 cursor-pointer transition-transform transform hover:scale-105"
                  >
                    <img
                      src={q.img}
                      alt=""
                      className="w-full h-24 object-cover mb-2"
                    />
                    <div className="flex flex-col space-y-2">
                      {[200, 400, 600].map((points) => (
                        <button
                          key={points}
                          className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-1 px-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
                          onClick={() => handlePointsClick(q.question, points)}
                        >
                          {points} Points
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team 2 Questions */}
            <div className="flex-1 p-4">
              <h2 className="text-2xl text-white mb-4 text-center">
                Team 2 Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team2Questions.map((q, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-md overflow-hidden p-4 cursor-pointer transition-transform transform hover:scale-105"
                  >
                    <img
                      src={q.img}
                      alt=""
                      className="w-full h-24 object-cover mb-2"
                    />
                    <div className="flex flex-col space-y-2">
                      {[200, 400, 600].map((points) => (
                        <button
                          key={points}
                          className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-1 px-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
                          onClick={() => handlePointsClick(q.question, points)}
                        >
                          {points} Points
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Over Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              onClick={handleGameOver}
            >
              Game Over
            </button>
          </div>

          {/* Modal for Question and Answer Display */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Question Modal"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                {findSelectedQuestion()?.question}
              </h2>
              {findSelectedQuestion()?.img && (
                <img
                  src={findSelectedQuestion().img}
                  alt=""
                  className="w-full h-32 object-cover mb-4"
                />
              )}
              <button
                className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
                onClick={handleViewAnswer}
              >
                View Answer
              </button>
              {viewAnswer && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-4">
                    Answer: {findSelectedQuestion()?.answer}
                  </h3>
                  <div className="flex justify-between space-x-4">
                    <button
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleCorrectAnswer("team1")}
                    >
                      Team 1 Correct
                    </button>
                    <button
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleCorrectAnswer("team2")}
                    >
                      Team 2 Correct
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        </>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
            <h2 className="text-2xl mb-6">Winner: {getWinner()}</h2>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center"
            >
              <span className="text-3xl font-bold">🎉</span>
            </motion.div>
            <button
              className="mt-8 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              onClick={() => setGameOver(false)}
            >
              Back to Game
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameInterface;
