import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { apiUrl } from "../Api";
import axios from "axios";
import { Play, Pause, X, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Sparkles, Star } from "lucide-react";
import Loader from "./Loader";
const GameInterface = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setloading] = useState(false);
  const [GameInfo, setGameInfo] = useState({
    GameName: "",
    Team1: "",
    Team1Score: "",
    Team2: "",
    Team2Score: "",
    team1Id: "",
    team2Id: "",
  });
  const [showAnswer, setshowAnswer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("location", location.state);
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
  }, [showAnswer]);

  const getQuestions = async () => {
    setloading(true);
    let loggedInUser = localStorage.getItem("user");
    loggedInUser = JSON.parse(loggedInUser);
    try {
      let dataToSend = {
        gameId: location.state.gameId,
        userData: loggedInUser,
      };
      let { data } = await axios.post(
        `${apiUrl}/user/getAllQuestionsForUser`,
        dataToSend
      );
      if (data.success) {
        // Assuming `data.LongInfo.catAndQues` contains the provided structure
        let GameName = data.LongInfo.myGames.GameName;
        let Team1 = data.LongInfo.teams[0].name;
        let Team2 = data.LongInfo.teams[1].name;
        let Team1Score = data.LongInfo.teams[0].score;
        let Team2Score = data.LongInfo.teams[1].score;
        setGameInfo({
          GameName: GameName,
          Team1,
          Team1Score,
          Team2,
          Team2Score,
          team1Id: data.LongInfo.teams[0]._id,
          team2Id: data.LongInfo.teams[1]._id,
        });
        setCategories(data.LongInfo.categoriesWithQuestions);
        setloading(false);
      }
    } catch (error) {
      setloading(false);
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

  const handleCorrectAnswer = async (team, teamid) => {
    if (modalContent) {
      const { category, questionIndex } = modalContent;
      const points = categories[category].questions[questionIndex].points;

      let newTeam1Score = GameInfo.Team1Score;
      let newTeam2Score = GameInfo.Team1Score;

      if (team === GameInfo.Team1) {
        newTeam1Score += Number(points);
        setTeam1Score(newTeam1Score);
      } else {
        newTeam2Score += Number(points);
        setTeam2Score(newTeam2Score);
      }

      setGameInfo({
        ...GameInfo,
        Team1Score: "⏳",
        Team2Score: "⏳",
      });

      setCategories((prevCategories) => {
        const newCategories = [...prevCategories];
        newCategories[category].questions[questionIndex].answered = true;
        return newCategories;
      });

      closeModal();

      // Prepare data to send to the backend
      let loggedInUser = localStorage.getItem("user");
      loggedInUser = JSON.parse(loggedInUser);
      const correctAnswerData = {
        userid: loggedInUser._id,
        gameName: GameInfo.GameName,
        categoryId: categories[category]._id, // Add category ID
        categoryName: categories[category].name,
        questionId: categories[category].questions[questionIndex]._id, // Add question ID
        question: categories[category].questions[questionIndex].question,
        answer: categories[category].questions[questionIndex].answer,
        pointsGot: points,
        correctTeam: team,
        categories,
        teamid,
      };

      try {
        await axios.post(
          `${apiUrl}/user/singleCorrectAnswer`,
          correctAnswerData
        );
        console.log("Data sent to backend successfully");
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }

      // Check if the game is over and all questions are answered
    }
  };
  const getWinner = () => {
    if (GameInfo.Team1Score > GameInfo.Team2Score)
      return GameInfo.Team1 + " يفوز";
    if (GameInfo.Team2Score > GameInfo.Team1Score)
      return GameInfo.Team2 + " يفوز";
    return "إنه تعادل!";
  };

  const areAllQuestionsAnswered = () => {
    let res = categories.every((category) =>
      category.questions.every((question) => question.answered === true)
    );
    if (res) {
      let results = getWinner();
      // navigate("/results", { state: { results } });
    }
    return res;
  };

  areAllQuestionsAnswered();

  const handleGameOver = () => {
    setGameOver(true);
  };

  // Get images url.
  const getImageSrc = (imageUrl) => {
    // Check if the image URL contains 'http' or 'https' indicating an external link
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl; // Return the external URL directly
    } else {
      return `${apiUrl}/images/${imageUrl}`; // Return local URL
    }
  };
  Modal.setAppElement("#root");

  return (
    <>
      <div>
        <img src="gameplaybg.png" alt="" />
      </div>
      <div className="min-h-screen bg-gradient-to-br p-4 flex flex-col">
        <h1 className="text-center font-bold text-white text-2xl">
          {GameInfo.GameName}
        </h1>
        {loading && <Loader />}
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-4">
          <div className="text-white text-xl font-bold">
            {GameInfo.Team1}: {GameInfo.Team1Score} نقاط
          </div>
          <div className="text-white text-xl font-bold">
            {GameInfo.Team2}: {GameInfo.Team2Score} نقاط
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg flex items-center justify-center overflow-hidden"
            >
              {/* Left Column: First 3 Questions */}
              <div className="-translate-y-5 -translate-x-5 flex-none w-1/4 p-2 flex flex-col items-end space-y-2">
                {category.questions
                  .slice(0, 3)
                  .map((question, questionIndex) => (
                    <button
                      key={questionIndex}
                      className={`p-3 rounded-full text-center ${
                        question.answered
                          ? "bg-gray-400 cursor-not-allowed border"
                          : "bg-gray-200 hover:bg-gray-400 text-black border"
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

              {/* Center Column: Category Image */}
              <div className="flex-none w-8/12 p-2 flex flex-col items-center flex-wrap">
                <img
                  src={getImageSrc(category.image)} // Use the function to determine the
                  alt={category.name}
                  className="rounded-lg"
                />
                <h2 className="text-lg font-bold text-white mt-2">
                  {category.name}
                </h2>
              </div>

              {/* Right Column: Last 3 Questions */}
              <div className="-translate-y-5 translate-x-5  flex-none w-1/4 p-2 flex flex-col items-start space-y-2">
                {category.questions
                  .slice(3, 6)
                  .map((question, questionIndex) => (
                    <button
                      key={questionIndex}
                      className={`p-3 rounded-full text-center  ${
                        question.answered
                          ? "bg-gray-400 cursor-not-allowed border"
                          : "bg-gray-200 hover:bg-gray-400 text-black border"
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
            انتهت اللعبة
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
                      ].image ? (
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
                  عرض الإجابة
                </button>
                {showAnswer && (
                  <div className="bg-gray-100 p-3 rounded-lg mb-4 border border-gray-200 shadow-sm">
                    <p className="text-gray-800">
                      إجابة:{" "}
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
                      handleCorrectAnswer(GameInfo.Team1, GameInfo.team1Id)
                    }
                  >
                    {GameInfo.Team1} صحيح
                  </button>
                  <button
                    className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 flex-1"
                    onClick={() =>
                      handleCorrectAnswer(GameInfo.Team2, GameInfo.team2Id)
                    }
                  >
                    {GameInfo.Team2} صحيح
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>

        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-gradient"></div>

              <div className="flex justify-center items-center mb-4">
                <Trophy className="text-yellow-500 w-12 h-12 mr-2 animate-bounce" />
                <Trophy className="text-yellow-500 w-12 h-12 ml-2 animate-bounce" />
              </div>
              {getWinner()}
              <Sparkles className="absolute top-4 right-4 text-yellow-400 w-6 h-6 animate-spin-slow" />
              <Sparkles className="absolute bottom-4 left-4 text-yellow-400 w-6 h-6 animate-spin-slow" />
              <Star className="absolute top-1/4 left-4 text-yellow-400 w-4 h-4 animate-pulse" />
              <Star className="absolute bottom-1/4 right-4 text-yellow-400 w-4 h-4 animate-pulse" />
              <br />
              <br />
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-shadow duration-300"
                onClick={() => setGameOver(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameInterface;
