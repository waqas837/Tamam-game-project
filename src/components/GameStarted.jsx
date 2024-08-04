import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { apiAdd } from "../Api";
import axios from "axios";
import { Play, Pause, X, RotateCcw } from "lucide-react";
import { useLocation } from "react-router-dom";

const GameInterface = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setshowAnswer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const location = useLocation();
  useEffect(() => {
    console.log("location", location.state);
    if (modalIsOpen) {
      setIsRunning(true); // Start the timer when the modal opens
    } else {
      setIsRunning(false); // Stop the timer when the modal closes
      setSeconds(0); // Reset the timer when modal is closed
    }
  }, [modalIsOpen]);
  useEffect(() => {
    let interval;
    if (modalIsOpen && isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!modalIsOpen) {
      setSeconds(0); // Reset timer when modal is closed
    }
    return () => clearInterval(interval);
  }, [modalIsOpen, isRunning]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };
  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    let loggedInUser = localStorage.getItem("user");
    loggedInUser = JSON.parse(loggedInUser);
    try {
      let dataToSend = {
        metaData: location.state,
        userData: loggedInUser,
      };
      let { data } = await axios.post(
        `${apiAdd}/user/getAllQuestionsForUser`,
        dataToSend
      );
      if (data.success) {
        setCategories(data.data);
        console.log("data.data", data.data);
      }
    } catch (error) {
      console.log("err in handleSubmit", error);
    }
  };
  const openModal = (category, questionIndex) => {
    setModalContent({ category, questionIndex });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
    setshowAnswer(!showAnswer);
  };

  const handleCorrectAnswer = (team) => {
    if (modalContent) {
      const { category, questionIndex } = modalContent;
      const points = categories[category].questions[questionIndex].points;

      if (team === location.state.teams.team1) {
        setTeam1Score((prevScore) => prevScore + points);
      } else {
        setTeam2Score((prevScore) => prevScore + points);
      }

      setCategories((prevCategories) => {
        const newCategories = [...prevCategories];
        newCategories[category].questions[questionIndex].answered = true;
        // let answerWithTeam = { newCategories, correctAnswerBy: team };
        // await axios.post(`${apiAdd}/user/answerByTeams`, answerWithTeam);
        return newCategories;
      });

      closeModal();
    }
    // check if game is over...and all are selected
    if (areAllQuestionsAnswered()) {
      handleGameOver();
    }
  };
  const areAllQuestionsAnswered = () => {
    let res = categories.every((category) =>
      category.questions.every((question) => question.answered)
    );
    console.log("what is res", res);
    return res;
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const getWinner = () => {
    if (team1Score > team2Score) return "Team 1 Wins!";
    if (team2Score > team1Score) return "Team 2 Wins!";
    return "It's a Tie!";
  };
  // Get images url.
  const getImageSrc = (imageUrl) => {
    // Check if the image URL contains 'http' or 'https' indicating an external link
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl; // Return the external URL directly
    } else {
      return `${apiAdd}/images/${imageUrl}`; // Return local URL
    }
  };
  Modal.setAppElement("#root");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-4 flex flex-col">
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-4">
        <div className="text-white text-xl font-bold">
          Team {location.state.teams.team1}: {team1Score} Points
        </div>
        <div className="text-white text-xl font-bold">
          Team {location.state.teams.team2}: {team2Score} Points
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {categories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="bg-white bg-opacity-30 backdrop-blur-lg shadow-md rounded-lg overflow-hidden h-72"
          >
            <div>
              <img
                src={getImageSrc(category.image)} // Use the function to determine the src
                alt={category.name}
                className="w-full h-32 rounded-t-lg"
              />
              <h2 className="text-lg font-bold text-center text-white mt-2">
                {category.name}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {category.questions.map((question, questionIndex) => (
                <button
                  key={questionIndex}
                  className={`p-2 rounded-lg shadow-sm text-center font-bold ${
                    question.answered
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() =>
                    !question.answered &&
                    openModal(categoryIndex, questionIndex)
                  }
                  disabled={question.answered}
                >
                  {question.points}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          onClick={handleGameOver}
        >
          Game Over
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Question Modal"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto relative">
          {modalContent && (
            <>
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-gray-900">
                    {formatTime(seconds)}
                  </span>
                  <button
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={toggleTimer}
                  >
                    {isRunning ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
                <button
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={closeModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-center mb-4">
                {
                  categories[modalContent.category].questions[
                    modalContent.questionIndex
                  ].question
                }
              </h2>

              {/* Conditional rendering for image or video */}
              {categories[modalContent.category].questions[
                modalContent.questionIndex
              ].image && (
                <>
                  {categories[modalContent.category].questions[
                    modalContent.questionIndex
                  ].image.match(
                    /\.(jpeg|jpg|gif|png|webp|bmp|svg|jif|tiff|tif|heif|heic|jfif)$/i
                  ) ? (
                    <img
                      src={getImageSrc(
                        categories[modalContent.category].questions[
                          modalContent.questionIndex
                        ].image
                      )}
                      alt="Question Media"
                      className="w-full h-auto rounded-lg mb-4 border border-gray-300 shadow-sm"
                    />
                  ) : categories[modalContent.category].questions[
                      modalContent.questionIndex
                    ].image.match(/\.(mp4|webm|ogg|avi|mov)$/i) ? (
                    <video
                      controls
                      className="w-full rounded-lg mb-4 border border-gray-300 shadow-sm"
                    >
                      <source
                        src={getImageSrc(
                          categories[modalContent.category].questions[
                            modalContent.questionIndex
                          ].image
                        )}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-red-600 text-center">
                      Unsupported media type
                    </p>
                  )}
                </>
              )}

              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 w-full mb-4"
                onClick={() => setshowAnswer(!showAnswer)}
              >
                View Answer
              </button>
              {showAnswer && (
                <div className="bg-gray-100 p-3 rounded-lg mb-4 border border-gray-200 shadow-sm">
                  <p className="text-gray-800">
                    Answer:{" "}
                    {
                      categories[modalContent.category].questions[
                        modalContent.questionIndex
                      ].answer
                    }
                  </p>
                </div>
              )}
              <div className="flex gap-4 mb-4">
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 flex-1"
                  onClick={() =>
                    handleCorrectAnswer(location.state.teams.team1)
                  }
                >
                  {location.state.teams.team1} Correct
                </button>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 flex-1"
                  onClick={() =>
                    handleCorrectAnswer(location.state.teams.team2)
                  }
                >
                  {location.state.teams.team2} Correct
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-center relative">
            <h2 className="text-3xl font-bold mb-3 text-black">
              {getWinner()}
            </h2>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-shadow duration-300"
              onClick={() => setGameOver(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameInterface;
