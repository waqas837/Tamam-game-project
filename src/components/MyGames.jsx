import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { X } from "lucide-react";
import { apiAdd } from "../Api";
import Loader from "./Loader";

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

// Get images url.
const getImageSrc = (imageUrl) => {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  } else {
    return `${apiAdd}/images/${imageUrl}`;
  }
};

const GameCard = ({ val, openModal }) => (
  <div onClick={openModal}>
    <Card className="cursor-pointer w-full max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
      <CardHeader>
        {val.currentPackage}
        <CardTitle>{val.myGames.FreePackage[0].Game1.GameName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {val.myGames.FreePackage[0].Game1.allQuestions.map(
            (category, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={getImageSrc(category.image)}
                  alt={category}
                  className="w-20 h-20 rounded-lg shadow-md border-2 border-pink-200"
                />
                <span className="mt-2 text-xs text-center text-pink-700">
                  {category.name}
                </span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

const GameCategoriesPage = () => {
  const navigate = useNavigate();
  const [GameInfo, setGameInfo] = useState({
    GameName: "",
    Team1: "",
    Team1Score: "",
    Team2: "",
    Team2Score: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setloading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    setloading(true);
    let loggedInUser = localStorage.getItem("user");
    loggedInUser = JSON.parse(loggedInUser);
    try {
      let dataToSend = {
        userData: loggedInUser,
      };
      let { data } = await axios.post(
        `${apiAdd}/user/getAllQuestionsForUser`,
        dataToSend
      );
      if (data.success) {
        let GameName = data.data.myGames.FreePackage[0].Game1.GameName;
        let Team1 = data.data.myGames.FreePackage[0].Game1.Teams[0].teamName;
        let Team2 = data.data.myGames.FreePackage[0].Game1.Teams[1].teamName;
        let Team1Score = data.data.myGames.FreePackage[0].Game1.Teams[0].score;
        let Team2Score = data.data.myGames.FreePackage[0].Game1.Teams[1].score;
        setGameInfo({
          GameName: GameName,
          Team1,
          Team1Score,
          Team2,
          Team2Score,
        });
        setCategories([data.data]);
        console.log("data.data", data.data);
        setloading(false);
      }
    } catch (error) {
      setloading(false);
      console.log("err in handleSubmit", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeModalStartOver = () => {
    setModalIsOpen(false);
  };

  const closeModalResume = () => {
    setModalIsOpen(false);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      borderRadius: "15px",
      padding: "30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "90%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-8">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-12 shadow-text">
        My Games
      </h1>
      <div className="text-center">{loading && <Loader />}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories &&
          categories.map((val, index) => (
            <GameCard val={val} key={index} openModal={openModal} />
          ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Game Options Modal"
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute -top-6 -right-5 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pr-8">
            What do you want to do with the game?
          </h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={closeModalStartOver}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Start Over
            </button>
            <button
              onClick={closeModalResume}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Resume
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GameCategoriesPage;
