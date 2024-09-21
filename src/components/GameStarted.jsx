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
import { toast, Toaster } from "react-hot-toast";
import ImageZoomer from "../utils/ImageZoomer";
import VideoLoop from "../utils/VideoLoop";

const GameInterface = () => {
  let interval;
  // modal states
  // state 1
  const [modalState, setmodalState] = useState({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  });
  const [qrcodeshow, setqrcodeshow] = useState({
    firstcode: false,
    secondcode: false,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setloading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [team1, setTeam1] = useState("");
  const [MeAnswer, setMeAnswer] = useState({ team1: false, team2: false });
  const [showHand, setshowHand] = useState(false);
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

  const [qrTeam1Answer, setqrTeam1Answer] = useState(
    localStorage.getItem(GameInfo.Team1)
  );
  const [qrTeam2Answer, setqrTeam2Answer] = useState(
    localStorage.getItem(GameInfo.Team2)
  );
  const [openNewModal, setopenNewModal] = useState(false);
  let userId;
  let loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    loggedInUser = JSON.parse(loggedInUser);
    userId = loggedInUser._id;
  }
  useEffect(() => {
    if (socket) {
      socket.on("answered", (data) => {
        console.log("data", data);
        let teamName = data.teamName;
        let answer = data.answer;
        localStorage.setItem(teamName, answer);
        setOutSourceAnswer(data);
        setopenNewModal(true);
      });
    }
    return () => {
      socket.off("answered");
    };
  }, [socket]);

  // handle-gameover
  const endGame = () => {
    toast.loading("Ending Game");
    setGameOver(false);
    setTimeout(() => {
      toast.dismiss();
      navigate("/my-games");
    }, 3000);
  };
  // modal handlers
  const seeAnswer = () => {
    //  off state1 and open state2
    resetTimer();
    setmodalState((prevState) => ({ ...prevState, step1: false, step2: true }));
  };
  const whoAnswer = () => {
    //  setModalIsOpen(false) // off modal
    //  off state1 and open state2
    setmodalState((prevState) => ({
      ...prevState,
      step1: false,
      step2: false,
      step3: true,
    }));
  };
  const noOneAnswer = async () => {
    setModalIsOpen(false); // off modal
    //  reset modal the states
    setmodalState({
      step1: true,
      step2: false,
      step3: false,
      step4: false,
    });
    // reset qrcode state
    setqrcodeshow({ firstcode: false, secondcode: false });
    setOutSourceAnswer(null);
    localStorage.removeItem(GameInfo.Team1);
    localStorage.removeItem(GameInfo.Team2);
    await disbleQuestionClosModal();
  };
  // showMoreQuestions wil be used later on
  const showMoreQuestions = (categoryIndex, questionsList) => {
    setModalIsOpen(true);
    setmodalState({ step1: false, step2: false, step3: false, step4: true });
    setModalContent({ category: categoryIndex, questionsList });
  };
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
    if (mean === "light") {
      if (teamId === GameInfo.team1Id) {
        setMeAnswer(() => ({ team1: true, team2: false }));
      } else if (teamId === GameInfo.team2Id) {
        setMeAnswer(() => ({ team1: false, team2: true }));
      }
    } else if (mean === "hand") {
      setshowHand(!showHand);
    }
    try {
      let { data } = await axios.put(`${apiUrl}/user/use-auxiliary-mean`, {
        teamId,
        mean,
      });
      if (data.success) {
        // await getQuestions();
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
  const openModal = (category, q_id) => {
    alert(q_id);
    setmodalState({ step1: true, step2: false, step3: false, step4: false });
    setModalContent({ category, q_id });
    setModalIsOpen(true);
  };

  const closeModal = async () => {
    setModalIsOpen(false);
    setModalContent(null);
    setMeAnswer({ team1: false, team2: false });
    localStorage.removeItem(GameInfo.Team1);
    localStorage.removeItem(GameInfo.Team2);
    // reset modal state
    setmodalState({ step1: true, step2: false, step3: false, step4: false });
    // reset qrcode state
    setqrcodeshow({ firstcode: false, secondcode: false });
    await disbleQuestionClosModal();
  };

  const disbleQuestionClosModal = async () => {
    if (modalContent) {
      const { category, q_id } = modalContent;
      let loggedInUser = localStorage.getItem("user");
      loggedInUser = JSON.parse(loggedInUser);
      const dataToSendDisableQues = {
        onCloseModal: true,
        gameid: location.state.gameId,
        questionId: q_id, // Add question ID
      };
      try {
        await axios.post(
          `${apiUrl}/user/singleCorrectAnswer`,
          dataToSendDisableQues
        );
        setshowAnswer(!showAnswer);
        setOutSourceAnswer(null);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
      // Check if the game is over and all questions are answered
    }
  };

  const handleCorrectAnswer = async (team, teamid) => {
    localStorage.removeItem(GameInfo.Team1);
    localStorage.removeItem(GameInfo.Team2);
    setshowAnswer(!showAnswer);
    setOutSourceAnswer(null);
    if (modalContent) {
      const { category, questionIndex } = modalContent;
      const points = categories[category].questions[questionIndex].points;

      let newTeam1Score = GameInfo.Team1Score;
      let newTeam2Score = GameInfo.Team1Score;

      if (team === GameInfo.Team1) {
        newTeam1Score += Number(points);
        // setTeam1Score(newTeam1Score);
      } else {
        newTeam2Score += Number(points);
        // setTeam2Score(newTeam2Score);
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
      // reste the modal state
      setmodalState({ step1: true, step2: false, step3: false, step4: false });
      closeModal();

      // Prepare data to send to the backend
      let loggedInUser = localStorage.getItem("user");
      loggedInUser = JSON.parse(loggedInUser);
      const correctAnswerData = {
        gameid: location.state.gameId,
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
        setshowAnswer(!showAnswer);
        setOutSourceAnswer(null);
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

  const handleGameOver = () => {
    setGameOver(true);
  };

  // Get images url.
  const getImageSrc = (imageUrl) => {
    if (imageUrl === null) {
      console.log("imageUrl", imageUrl);
    }
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
      {/* <NewModal
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
      </NewModal> */}
      <div className="flex flex-col">
        {/* <h1 className="text-center text-2xl text-pink-600">
          {GameInfo.GameName}
        </h1> */}
        {loading && <Loader />}
        {/* <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-4">
          <div className="text-white text-xl font-bold">
            {GameInfo.Team1}: {GameInfo.Team1Score} نقاط
          </div>
          <div className="text-white text-xl font-bold">
            {GameInfo.Team2}: {GameInfo.Team2Score} نقاط
          </div>
        </div> */}
        <div className="-mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-x-6 gap-y-5 w-full mx-auto">
          {categories.map((category, categoryIndex) => {
            let firstHalfQuestions;
            let secondHalfQuestions;
            let secondHalfIndex = 3;
            let sixBySixSlices = [];
            // Need every six elements
            for (let i = 0; i < category.questions.length; i = i + 6) {
              let sixBySix = category.questions.slice(i, i + 6);
              sixBySixSlices.push(sixBySix);
            }

            for (let i = 0; i < sixBySixSlices.length; i++) {
              const element = sixBySixSlices[i];
              firstHalfQuestions = element.slice(0, 3);
              secondHalfQuestions = element.slice(3, 6);
              let allAnswered = element.every((val) => val.answered === true);
              if (!allAnswered) {
                // secondHalfIndex = secondHalfIndex + 6;
                break;
              }
            }
            // console.log("secondHalfIndex", secondHalfIndex);
            return (
              <div
                key={categoryIndex}
                className="relative flex flex-col items-center justify-center"
              >
                {/* Image and category name */}
                <div className="relative flex flex-col justify-center items-center">
                  <img
                    src={getImageSrc(category.image)}
                    alt={category.name}
                    className="w-52 h-[150px] object-cover"
                  />
                  <div className="absolute bottom-0 bg-white bg-opacity-75 w-full text-center py-2">
                    {category.name}
                  </div>

                  {/* Left Column: First half of the questions */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-[-30px] flex flex-col space-y-2">
                    {firstHalfQuestions.map((question, questionIndex) => (
                      <button
                        key={questionIndex}
                        className={`px-6 py-1 text-2xl transform ${
                          question.answered
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-400 text-black"
                        }`}
                        onClick={() =>
                          !question.answered &&
                          openModal(categoryIndex, question._id)
                        }
                        disabled={question.answered}
                      >
                        {question.points}
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Second half of the questions */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-[-30px] flex flex-col space-y-2">
                    {secondHalfQuestions.map((question, questionIndex) => (
                      <button
                        key={questionIndex}
                        className={`px-6 py-1 text-2xl transform ${
                          question.answered
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-400 text-black"
                        }`}
                        onClick={() =>
                          !question.answered &&
                          openModal(categoryIndex, question._id)
                        }
                        disabled={question.answered}
                      >
                        {question.points}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section>
          <form onSubmit={handleSubmit} className="space-y-6 -mt-0">
            {error && (
              <p className="text-red-300 text-center bg-red-500 bg-opacity-20 py-2 rounded-lg">
                {error}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 text-center">
              {/* Team 1 */}
              <div className="text-xs w-10/12 flex flex-col items-center space-y-2">
                {/* <img src="team.png" width={40} height={50} alt="team.png" /> */}
                <p className="text-sm text-pink-400">{GameInfo.Team1}</p>
                <div className="w-10/12 border-2 px-8 py-1 rounded-md bg-white">
                  {GameInfo.Team1Score}
                </div>
              </div>
              {/* Team 2 */}
              <div className="text-xs w-10/12 flex flex-col items-center space-y-2">
                <p className="text-sm text-pink-400">{GameInfo.Team2}</p>
                <div className="w-10/12 border-2 px-8 py-1 rounded-md bg-white">
                  {GameInfo.Team2Score}
                </div>

                {/* <h1>وسائل مساعدة</h1> */}
                {/* images */}
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
          className="fixed inset-0 w-full h-full m-0 p-0 flex items-center justify-center" // Fullscreen modal
          overlayClassName="fixed inset-0 bg-black bg-opacity-70" // Fullscreen overlay
        >
          {/* step 1 */}
          {modalState.step1 && (
            <div className="bg-white p-6 shadow-lg h-screen w-full mx-auto relative">
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
                  <div className="mb-10">
                    <h2 className="text-lg font-semibold text-center mb-4 rounded bg-[#f4c93d6e]">
                      {(() => {
                        console.log("modalContent.q_id", modalContent.q_id);
                        console.log(
                          "what is here",
                          categories[modalContent.category].questions.find(
                            (val) => val._id === modalContent.q_id
                          )
                        );
                      })()}
                      {
                        categories[modalContent.category].questions.find(
                          (val) => val._id === modalContent.q_id
                        ).question
                      }
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* section 1 */}
                    <div className="flex flex-col items-center gap-y-10">
                      <p className="text-[18px] text-center mb-2">
                        إجابة الفريق الأول
                      </p>
                      <div className="p-3 border-2 rounded-xl">
                        {qrcodeshow.secondcode ? (
                          <QRCodeSVG
                            size={100}
                            value={`${frontendWebAddress}/answer/${GameInfo.Team1}/${userId}`}
                          />
                        ) : (
                          <button
                            onClick={() =>
                              setqrcodeshow((prevState) => ({
                                ...prevState,
                                secondcode: !qrcodeshow.secondcode,
                              }))
                            }
                            className="bg-green-500 text-white text-sm font-medium py-1 px-2 rounded hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                          >
                            Generate QR Code
                          </button>
                        )}
                      </div>
                      <div className="text-xs w-10/12 flex flex-col items-center space-y-2">
                        {/* images */}
                        <div>
                          {/* <button
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team1Id, "hand")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                          </button>  */}
                          &nbsp;
                          <button
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team1Id, "rating")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team1Id, "light")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team1Id, "women")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                        <div className="w-full">
                          <h2 className="text-lg font-semibold text-center mb-4 rounded bg-[#f4c93d6e]">
                            {MeAnswer.team1 &&
                              !GameInfo.team1usedAuxMeans.light &&
                              "Hint: " +
                                categories[modalContent.category].questions[
                                  modalContent.questionIndex
                                ].hint}
                          </h2>
                        </div>
                        {showHand && (
                          <>
                            <br />
                            <div class="flex space-x-4">
                              <button class="border-2 border-gray-300 text-gray-500  -500   font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
                                Right Answer :
                                {
                                  categories[modalContent.category].questions[
                                    modalContent.questionIndex
                                  ].rightanswer
                                }
                              </button>

                              <button class="border-2 border-gray-300 text-gray-500     font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
                                Wrong Answer :
                                {
                                  categories[modalContent.category].questions[
                                    modalContent.questionIndex
                                  ].wronganswer
                                }
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* section 2 */}
                    <div className="flex flex-col items-center">
                      {/* Conditional rendering for image or video */}
                      {categories[modalContent.category].questions.find(
                        (val) => val._id === modalContent.q_id
                      ).image && (
                        <>
                          {categories[modalContent.category].questions
                            .find((val) => val._id === modalContent.q_id)
                            .image.match(
                              /\.(jpeg|jpg|gif|png|webp|bmp|svg|jif|tiff|tif|heif|heic|jfif)$/i
                            ) ? (
                            <ImageZoomer
                              src={
                                categories[
                                  modalContent.category
                                ].questions.find(
                                  (val) => val._id === modalContent.q_id
                                ).image
                              }
                            />
                          ) : categories[modalContent.category].questions.find(
                              (val) => val._id === modalContent.q_id
                            ).image ? (
                            <>
                              <VideoLoop
                                categories={categories}
                                modalContent={modalContent}
                              />
                            </>
                          ) : (
                            <p className="text-red-600 text-center">
                              Unsupported media type
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    {/* section 3 */}
                    <div className="flex flex-col items-center gap-y-10">
                      <p className="text-[18px] text-center mb-2">
                        إجابة الفريق الثاني
                      </p>
                      <div className="p-3 border-2 rounded-xl">
                        {qrcodeshow.firstcode ? (
                          <QRCodeSVG
                            size={100}
                            value={`${frontendWebAddress}/answer/${GameInfo.Team2}/${userId}`}
                          />
                        ) : (
                          <button
                            onClick={() =>
                              setqrcodeshow((...prevState) => ({
                                ...prevState,
                                firstcode: !qrcodeshow.firstcode,
                              }))
                            }
                            className="bg-green-500 text-white text-sm font-medium py-1 px-2 rounded hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                          >
                            Generate QR Code
                          </button>
                        )}
                      </div>
                      <div className="text-xs w-10/12 flex flex-col items-center space-y-2">
                        <div>
                          {/* <button
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team2Id, "hand")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                          </button>  */}
                          &nbsp;
                          <button
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team2Id, "rating")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team2Id, "light")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                            className="focus:ring focus:rounded-full"
                            onClick={() =>
                              handleAuxilaryMeans(GameInfo.team2Id, "women")
                            }
                          >
                            <img
                              width={40}
                              height={40}
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
                        <div className="w-full">
                          <h2 className="text-lg font-semibold text-center mb-4 rounded bg-[#f4c93d6e]">
                            {MeAnswer.team2 &&
                              !GameInfo.team2usedAuxMeans.light &&
                              "Hint: " +
                                categories[modalContent.category].questions[
                                  modalContent.questionIndex
                                ].hint}
                          </h2>
                        </div>
                      </div>

                      {/* {showHand && (
                        <div class="flex space-x-4 text-[12px]">
                          <button class="border-2 border-gray-300 text-gray-500  -500   font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
                            Right Answer :
                            {
                              categories[modalContent.category].questions[
                                modalContent.questionIndex
                              ].rightanswer
                            }
                          </button>

                          <button class="border-2 border-gray-300 text-gray-500     font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
                            Wrong Answer :
                            {
                              categories[modalContent.category].questions[
                                modalContent.questionIndex
                              ].wronganswer
                            }
                          </button>
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="my-10 text-center">
                    <br />
                    <button
                      onClick={() => seeAnswer()}
                      className="text-white bg-gradient-to-r from-pink-500 to-red-500 border-2 border-pink-500 px-32 py-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-pink-500/50"
                    >
                      See Answer
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {/* step 2 */}
          {modalState.step2 && (
            <div className="bg-white p-6 shadow-lg h-screen w-full mx-auto relative">
              {modalContent && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-center mb-5 border-b border-gray-200 pb-3  ">
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
                  <div className="mb-10">
                    <h2 className="text-lg font-semibold text-center mb-4 rounded bg-[#f4c93d6e]">
                      {
                        categories[modalContent.category].questions[
                          modalContent.questionIndex
                        ].answer
                      }
                    </h2>
                  </div>

                  {/* <p className="text-[#099BFF] text-center text-[30px] my-1">
                  {
                    categories[modalContent.category].questions[
                      modalContent.questionIndex
                    ].answer
                  }
                </p> */}
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* section 1 */}
                    <div className="flex flex-col items-center gap-y-52">
                      <p className="text-[18px] text-center mb-2">
                        إجابة الفريقالأول
                      </p>
                      <div className="p-3 border-2 rounded-xl">
                        <p>
                          {localStorage.getItem(GameInfo.Team1)
                            ? localStorage.getItem(GameInfo.Team1)
                            : "QRCode not Used"}
                        </p>
                      </div>
                    </div>
                    {/* section 2 */}
                    <div className="flex flex-col items-center">
                      {/* Conditional rendering for image or video/answer document show here */}

                      {categories[modalContent.category].questions[
                        modalContent.questionIndex
                      ].document && (
                        <>
                          {categories[modalContent.category].questions[
                            modalContent.questionIndex
                          ].document.match(
                            /\.(jpeg|jpg|gif|png|webp|bmp|svg|jif|tiff|tif|heif|heic|jfif)$/i
                          ) ? (
                            <ImageZoomer
                              src={
                                categories[modalContent.category].questions[
                                  modalContent.questionIndex
                                ].document
                              }
                            />
                          ) : (
                            <>
                              <VideoLoop
                                categories={categories}
                                modalContent={modalContent}
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {/* section 3 */}
                    <div className="flex flex-col items-center gap-y-52">
                      <p className="text-[18px] text-center mb-2">
                        إجابة الفريق الثاني
                      </p>
                      <div className="p-3 border-2 rounded-xl">
                        <p>
                          {localStorage.getItem(GameInfo.Team2)
                            ? localStorage.getItem(GameInfo.Team2)
                            : "QRCode not Used"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="my-10 text-center">
                    <br />
                    <button
                      onClick={() => whoAnswer()}
                      className="text-white bg-gradient-to-r from-pink-500 to-red-500 border-2 border-pink-500 px-32 py-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-pink-500/50"
                    >
                      Who Answer
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {/* step 3 */}
          {modalState.step3 && (
            <div className="bg-white p-6 shadow-lg h-screen w-full mx-auto relative">
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
                  <div className="mb-10">
                    <h2 className="text-lg font-semibold text-center mb-4 rounded bg-[#f4c93d6e]">
                      {
                        categories[modalContent.category].questions[
                          modalContent.questionIndex
                        ].answer
                      }
                    </h2>
                  </div>

                  {/* <p className="text-[#099BFF] text-center text-[30px] my-1">
                  {
                    categories[modalContent.category].questions[
                      modalContent.questionIndex
                    ].answer
                  }
                </p> */}
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* section 1 */}
                    <div className="flex flex-col items-center gap-y-14">
                      <p className="text-[18px] text-center mb-2">
                        إجابة الفريق الأول
                      </p>

                      <img
                        src="team.png"
                        alt="team.png"
                        title="This is team icon"
                        className="w-16 h-16 mb-2"
                      />
                      <p className="text-center">الفريق الأول</p>
                      <div>
                        <button
                          className="bg-gray-200 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 flex-1"
                          onClick={() =>
                            handleCorrectAnswer(
                              GameInfo.Team1,
                              GameInfo.team1Id
                            )
                          }
                        >
                          {GameInfo.Team1} صحيح
                        </button>
                      </div>
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
                            <ImageZoomer
                              src={
                                categories[modalContent.category].questions[
                                  modalContent.questionIndex
                                ].image
                              }
                            />
                          ) : categories[modalContent.category].questions[
                              modalContent.questionIndex
                            ].image ? (
                            <VideoLoop
                              categories={categories}
                              modalContent={modalContent}
                            />
                          ) : (
                            // <video
                            //   controls
                            //   loop
                            //   className="w-[100%] h-[200px] rounded-lg mb-4 border border-gray-300 shadow-sm"
                            // >
                            //   <source
                            //     src={getImageSrc(
                            //       categories[modalContent.category].questions[
                            //         modalContent.questionIndex
                            //       ].image
                            //     )}
                            //   />
                            //   Your browser does not support the video tag.
                            // </video>
                            <p className="text-red-600 text-center">
                              Unsupported media type
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    {/* section 3 */}
                    <div className="flex flex-col items-center gap-y-14">
                      <p className="text-[18px] text-center mb-2">
                        إجابة الفريق الثاني
                      </p>

                      <img
                        src="team.png"
                        alt="team.png"
                        title="This is team icon"
                        className="w-16 h-16 mb-2"
                      />
                      <p className="text-center">الفريق الثاني</p>
                      <div>
                        <button
                          className="bg-gray-200 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 flex-1"
                          onClick={() =>
                            handleCorrectAnswer(
                              GameInfo.Team2,
                              GameInfo.team2Id
                            )
                          }
                        >
                          {GameInfo.Team2} صحيح
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="my-10 text-center">
                    <br />
                    <button
                      onClick={() => noOneAnswer()}
                      className="text-white bg-gradient-to-r from-pink-500 to-red-500 border-2 border-pink-500 px-32 py-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-pink-500/50"
                    >
                      No One Answer
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {modalState.step4 && (
            <div className="bg-white p-6 shadow-lg h-screen w-full mx-auto relative">
              <button
                className="text-gray-600 hover:text-gray-800 transition-colors mt-4 md:mt-0"
                onClick={closeModal}
              >
                <X className="w-6 h-6" />
              </button>
              {modalContent && (
                <div className="flex flex-col items-center justify-center p-4 sm:p-8">
                  <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-purple-800">
                      {categories[modalContent.category].name}
                    </h1>

                    <div className="mb-8">
                      <img
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                        src={getImageSrc(
                          categories[modalContent.category].image
                        )}
                        alt=""
                      />
                    </div>

                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
                      Questions
                    </h2>

                    <div className="flex flex-wrap justify-center gap-4">
                      {modalContent?.questionsList?.map(
                        (question, questionIndex) => (
                          <button
                            key={questionIndex}
                            className={`w-16 h-16 rounded-full text-center text-xl sm:text-2xl font-bold transition-colors duration-200 ${
                              question.answered
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300 text-black"
                            }`}
                            onClick={() =>
                              !question.answered &&
                              openModal(modalContent.category, question._id)
                            }
                            disabled={question.answered}
                          >
                            {question.points}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
                onClick={() => endGame()}
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
