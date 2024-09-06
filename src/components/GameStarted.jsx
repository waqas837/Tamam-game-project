import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { apiUrl, frontendWebAddress } from "../Api";
import axios from "axios";
import { Play, Pause, X, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Sparkles, Star } from "lucide-react";
import Loader from "./Loader";
import { QRCodeSVG } from "qrcode.react";
import socket from "../socket";
import { Modal as NewModal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const GameInterface = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setloading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [team1, setTeam1] = useState("");
  const [GameInfo, setGameInfo] = useState({
    GameName: "",
    Team1: "",
    Team1Score: "",
    Team2: "",
    Team2Score: "",
    team1Id: "",
    team2Id: "",
    team1usedAuxMeans: {},
    team2usedAuxMeans: {},
  });
  const [showAnswer, setshowAnswer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const location = useLocation();
  const [team2, setTeam2] = useState("");
  const [gameid, setgameid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [OutSourceAnswer, setOutSourceAnswer] = useState();
  const [openNewModal, setopenNewModal] = useState(false);
  useEffect(() => {
    if (socket) {
      socket.on("answered", (data) => {
        setOutSourceAnswer(data);
        setopenNewModal(true);
      });
    }
    return () => {
      socket.off("answered");
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    return;
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      toast.error("يرجى تسجيل الدخول أولاً.");
      return;
    }

    loggedInUser = JSON.parse(loggedInUser);

    if (!gameName || !team1 || !team2) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    if (categoriesIds.length < 6) {
      setError("Please Select at least 6 Categories Above.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let gameCreate = {
        userId: loggedInUser._id,
        categoriesIds,
        gameName,
        team1,
        team2,
        team1Score, // Include team1Score in the request
        team2Score, // Include team2Score in the request
      };
      let { data } = await axios.post(`${apiUrl}/user/createGame`, gameCreate);
      if (data.success === false) {
        toast.error("Your limit is reached. Please buy package instead.");
      } else if (data.success) {
        toast.success(data.message);
        setGameName("");
        setTeam1("");
        setTeam2("");
        setTeam1Score(0); // Reset team1 score
        setTeam2Score(0); // Reset team2 score
        navigate("/started-game", {
          state: {
            categoriesIds,
            gameId: data.gameid,
            teams: { gameName, team1, team2, team1Score, team2Score },
          },
        });
      }
    } catch (error) {
      console.error("error", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // handleAuxilaryMeans
  const handleAuxilaryMeans = async (teamId, mean) => {
    try {
      let { data } = await axios.put(`${apiUrl}/user/use-auxiliary-mean`, {
        teamId,
        mean,
      });
      if (data.success) {
        // re-render
        await getQuestions();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // Increment and Decrement Handlers
  const incrementScore = (team) => {
    if (team === "team1") setTeam1Score((prevScore) => prevScore + 1);
    else setTeam2Score((prevScore) => prevScore + 1);
  };

  const decrementScore = (team) => {
    if (team === "team1" && team1Score > 0)
      setTeam1Score((prevScore) => prevScore - 1);
    else if (team === "team2" && team2Score > 0)
      setTeam2Score((prevScore) => prevScore - 1);
  };
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
        console.log("data.LongInfo", data.LongInfo);
        setGameInfo({
          GameName: GameName,
          Team1,
          Team1Score,
          Team2,
          Team2Score,
          team1Id: data.LongInfo.teams[0]._id,
          team2Id: data.LongInfo.teams[1]._id,
          team1usedAuxMeans: data.LongInfo.teams[0].usedAxiliaryMeans,
          team2usedAuxMeans: data.LongInfo.teams[1].usedAxiliaryMeans,
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
      <NewModal
        open={openNewModal}
        onClose={() => setopenNewModal(false)}
        center
      >
        <div className="p-10 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Remote Answer
          </h1>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            TEAM: <span className="font-bold">{OutSourceAnswer?.teamName}</span>
          </h3>
          <h3 className="text-lg font-medium text-gray-600">
            Answer: <span className="font-bold">{OutSourceAnswer?.answer}</span>
          </h3>
        </div>
      </NewModal>
      <div className="min-h-screen bg-gradient-to-br p-4 flex flex-col">
        <h1 className="text-center text-2xl text-pink-600">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 space-y-6 max-w-7xl mx-auto">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg flex items-center justify-center"
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
              <div>
                <img
                  src={getImageSrc(category.image)} // Use the function to determine the
                  alt={category.name}
                  className="rounded-lg"
                />
                <h2 className="mt-2 text-center">{category.name}</h2>
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

        <section className="bg-[url('pathcreategame.png')] bg-no-repeat bg-cover py-12 m-auto text-center w-full p-20 mt-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-red-300 text-center bg-red-500 bg-opacity-20 py-2 rounded-lg">
                {error}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 m-auto text-center place-items-center">
              {/* Team 1 */}
              <div className="w-full flex flex-col items-center space-y-4">
                <img src="team.png" alt="team.png" />
                <p className="text-[25px] text-pink-500">{GameInfo.Team1}</p>
                <div className="w-full border-2 px-8 py-2 rounded-md bg-white">
                  {GameInfo.Team1Score}
                </div>
                <div className="w-full bg-gray-100 rounded-md flex justify-between items-center p-1 text-white">
                  <button
                    type="button"
                    className="bg-pink-400 rounded-full px-3 py-1"
                    onClick={() => incrementScore("team1")}
                  >
                    +
                  </button>
                  <p className="text-black">{team1Score}</p>
                  <button
                    type="button"
                    className="bg-pink-400 rounded-full px-3 py-1"
                    onClick={() => decrementScore("team1")}
                  >
                    -
                  </button>
                </div>
                <h1>وسائل مساعدة</h1>
                {/* images */}
                <div>
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team1Id, "hand")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team1usedAuxMeans.hand
                          ? "/color/hand.png"
                          : "/simple/hand.png"
                      }`}
                      className={`${
                        GameInfo.team1usedAuxMeans.hand
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                      alt=""
                    />
                  </button>{" "}
                  &nbsp;
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team1Id, "rating")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team1usedAuxMeans.rating
                          ? "/color/rating.png"
                          : "/simple/rating.png"
                      }`}
                      className={`${
                        GameInfo.team1usedAuxMeans.rating
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                    />
                  </button>{" "}
                  &nbsp;
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team1Id, "light")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team1usedAuxMeans.light
                          ? "/color/light.png"
                          : "/simple/light.png"
                      }`}
                      className={`${
                        GameInfo.team1usedAuxMeans.light
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                    />
                  </button>{" "}
                  &nbsp;
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team1Id, "women")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team1usedAuxMeans.women
                          ? "/color/women.png"
                          : "/simple/women.png"
                      }`}
                      className={`${
                        GameInfo.team1usedAuxMeans.women
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
              {/* Team 2 */}
              <div className="w-full flex flex-col items-center space-y-4">
                <img src="team.png" alt="" />
                <p className="text-[25px] text-pink-500">{GameInfo.Team2}</p>
                <div className="w-full border-2 px-8 py-2 rounded-md bg-white">
                  {GameInfo.Team2Score}
                </div>
                <div className="w-full bg-gray-100 rounded-md flex justify-between items-center p-1 text-white">
                  <button
                    type="button"
                    className="bg-pink-400 rounded-full px-3 py-1"
                    onClick={() => incrementScore("team2")}
                  >
                    +
                  </button>
                  <p className="text-black">{team2Score}</p>
                  <button
                    type="button"
                    className="bg-pink-400 rounded-full px-3 py-1"
                    onClick={() => decrementScore("team2")}
                  >
                    -
                  </button>
                </div>
                <h1>وسائل مساعدة</h1>
                {/* images */}
                <div>
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team2Id, "hand")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team2usedAuxMeans.hand
                          ? "/color/hand.png"
                          : "/simple/hand.png"
                      }`}
                      className={`${
                        GameInfo.team2usedAuxMeans.hand
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                      alt=""
                    />
                  </button>{" "}
                  &nbsp;
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team2Id, "rating")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team2usedAuxMeans.rating
                          ? "/color/rating.png"
                          : "/simple/rating.png"
                      }`}
                      className={`${
                        GameInfo.team2usedAuxMeans.rating
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                    />
                  </button>{" "}
                  &nbsp;
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team2Id, "light")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team2usedAuxMeans.light
                          ? "/color/light.png"
                          : "/simple/light.png"
                      }`}
                      className={`${
                        GameInfo.team2usedAuxMeans.light
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                    />
                  </button>{" "}
                  &nbsp;
                  <button
                    onClick={() =>
                      handleAuxilaryMeans(GameInfo.team2Id, "women")
                    }
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${
                        GameInfo.team2usedAuxMeans.women
                          ? "/color/women.png"
                          : "/simple/women.png"
                      }`}
                      className={`${
                        GameInfo.team2usedAuxMeans.women
                          ? "border border-pink-500 rounded-full"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>

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
          className="fixed inset-0 flex items-center justify-center p-4 w-full"
          overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto relative">
            {modalContent && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-center mb-5 border-b border-gray-200 pb-3">
                  <div className="m-auto p-2 px-5 flex justify-center items-center text-white bg-[#D140C8] gap-x-8 rounded-full">
                    <button
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={toggleTimer}
                    >
                      {isRunning ? (
                        <Pause className="w-5 h-5" color="#F5C527" />
                      ) : (
                        <Play className="w-5 h-5" color="#F5C527" />
                      )}
                    </button>
                    <span className="text-xl">{formatTime(seconds)}</span>
                    <button
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={resetTimer}
                    >
                      <RotateCcw className="w-5 h-5" color="#F5C527" />
                    </button>
                  </div>
                  <button
                    className="text-gray-600 hover:text-gray-800 transition-colors mt-4 md:mt-0"
                    onClick={closeModal}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <h2 className="text-lg font-semibold text-center mb-4 rounded bg-[#f4c93d6e]">
                  {
                    categories[modalContent.category].questions[
                      modalContent.questionIndex
                    ].question
                  }
                </h2>

                {/* <p className="text-[#099BFF] text-center text-[30px] my-1">
                  {
                    categories[modalContent.category].questions[
                      modalContent.questionIndex
                    ].answer
                  }
                </p> */}
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* section 1 */}
                  <div className="flex flex-col items-center gap-y-5">
                    <p className="text-[18px] text-center mb-2">
                      إجابة الفريق الأول
                    </p>
                    <div className="p-3 border-2 rounded-xl">
                      <QRCodeSVG
                        o
                        size={100}
                        value={`${frontendWebAddress}/answer/${GameInfo.Team1}`}
                      />
                    </div>
                    <img
                      src="team.png"
                      alt="team.png"
                      title="This is team icon"
                      className="w-16 h-16 mb-2"
                    />
                    <p className="text-center">الفريق الأول</p>
                    <button
                      className="bg-gray-200 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 flex-1"
                      onClick={() =>
                        handleCorrectAnswer(GameInfo.Team1, GameInfo.team1Id)
                      }
                    >
                      {GameInfo.Team1} صحيح
                    </button>
                  </div>
                  {/* section 2 */}
                  <div className="flex flex-col items-center">
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
                            className="w-[100%] h-[100%] rounded-md"
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
                  </div>
                  {/* section 3 */}
                  <div className="flex flex-col items-center gap-y-5">
                    <p className="text-[18px] text-center mb-2">
                      إجابة الفريق الأول
                    </p>
                    <div className="p-3 border-2 rounded-xl">
                      <QRCodeSVG
                        size={100}
                        value={`${frontendWebAddress}/answer/${GameInfo.Team2}`}
                      />
                    </div>
                    <img
                      src="team.png"
                      alt="team.png"
                      title="This is team icon"
                      className="w-16 h-16 mb-2"
                    />
                    <p className="text-center">الفريق الثاني</p>
                    <button
                      className="bg-gray-200 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 flex-1"
                      onClick={() =>
                        handleCorrectAnswer(GameInfo.Team2, GameInfo.team2Id)
                      }
                    >
                      {GameInfo.Team2} صحيح
                    </button>
                  </div>
                </div>
                <div className="my-10 text-center">
                  <h1>من جواب على السؤال</h1>
                  <br />
                  <button
                    onClick={() => setModalIsOpen(false)}
                    className="text-red-500 border px-32 py-2 rounded-lg"
                  >
                    لم يجب أحد
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>

        {gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto text-center relative ">
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
