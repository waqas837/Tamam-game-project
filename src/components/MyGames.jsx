import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { X } from "lucide-react";
import { apiUrl } from "../Api";
import Loader from "./Loader";
import toast, { Toaster } from "react-hot-toast";

Modal.setAppElement("#root"); // Use the ID of your root element

// Helper components
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
  <h2 className={`text-2xl font-bold text-gray-500 ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Get images url
const getImageSrc = (imageUrl) => {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  } else {
    return `${apiUrl}/images/${imageUrl}`;
  }
};

// GameCard component
const GameCard = ({ val, openModal }) => (
  <div onClick={() => openModal(val._id, val.GameName, val.teams)}>
    <Card className="cursor-pointer w-full max-w-md mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200">
      <CardHeader className="text-2xl font-semibold text-center text-purple-800 pb-2 border-b border-pink-200">
        {val.GameName}
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {val.categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md border-2 border-pink-300">
                <img
                  src={getImageSrc(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-3 text-sm font-medium text-center text-purple-700">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main GameCategoriesPage component
const GameCategoriesPage = () => {
  const navigate = useNavigate();
  const [currentGameId, setCurrentGameId] = useState(null);
  const [currentGameName, setCurrentGameName] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [moneySpent, setmoneySpent] = useState([]);
  const [RemainingGames, setRemainingGames] = useState(0);
  const [user, setUser] = useState(null);
  const [Teams, setTeams] = useState(null);

  useEffect(() => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      toast("Please Login");
      return;
    }
    setUser(JSON.parse(loggedInUser));
    getQuestions();
  }, [navigate]);

  const getQuestions = async () => {
    setLoading(true);
    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    try {
      let dataToSend = {
        userData: loggedInUser,
        fetchAllGames: true,
      };
      let { data } = await axios.post(
        `${apiUrl}/user/getAllQuestionsForUser`,
        dataToSend
      );
      console.log("data", data);
      if (data.success) {
        setCategories(data.YourGames);
        setmoneySpent(data.moneySpent);
        setRemainingGames(data.remainingGames);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("err in handleSubmit", error);
    }
  };

  const openModal = (gameId, gameName, currentTeam) => {
    setCurrentGameId(gameId);
    setCurrentGameName(gameName);
    setTeams(currentTeam);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentGameId(null);
    setCurrentGameName(null);
  };

  const closeModalStartOver = async () => {
    try {
      let loggedInUser = JSON.parse(localStorage.getItem("user"));
      setModalIsOpen(false);
      console.log("Teams[1]._id", Teams[1]._id);
      let { data } = await axios.put(
        `${apiUrl}/user/startovergame/${loggedInUser._id}/${currentGameId}/${Teams[0]._id}/${Teams[1]._id}`
      );
      if (data.success) {
        // You might want to refresh the games list or navigate to a new page here
        navigate("/started-game", {
          state: { gameId: currentGameId, gameName: currentGameName },
        });
        getQuestions(); // Refresh the games list
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const closeModalResume = () => {
    setModalIsOpen(false);
    navigate("/started-game", {
      state: { gameId: currentGameId, gameName: currentGameName },
    });
  };

  // Modal styles
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
    <>
      <div className="p-8 my-20">
        <h1 className="text-5xl text-gray-500 text-center mb-12 shadow-text">
          User Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">User</h2>
            <p className="text-lg text-gray-600">John Doe</p>
            <p className="text-lg text-gray-600">Email: john.doe@example.com</p>
          </div> */}
          <Toaster />
          {/* Money Spent */}
          {/* <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">
              Money Spent
            </h2>
            <p className="text-3xl text-pink-500 font-semibold">
              {moneySpent} KD
            </p>
          </div> */}

          {/* Current Games */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">
              Current Games
            </h2>
            <p className="text-3xl text-pink-500 font-semibold">
              {categories && categories.length}
            </p>
          </div>

          {/* Online/Offline Status */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">My Status</h2>
            <div className="flex items-center">
              <p>Online</p> <p></p>
              <p className={`h-4 w-4 rounded-full mr-2 bg-green-500`}></p>
            </div>
          </div>

          {/* Remaining Games */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">
              {" "}
              Games Remaining
            </h2>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-pink-500 mb-4">
                {" "}
                {RemainingGames ? RemainingGames : "0"}
              </p>{" "}
              <p></p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold text-gray-500 text-center mb-12 shadow-text">
          ألعابي
        </h1>
        {!loading && categories.length === 0 && (
          <h1 className="text-center">لم يتم العثور على ألعاب!</h1>
        )}
        <div className="text-center">{loading && <Loader />}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((val, index) => (
            <GameCard val={val} key={index} openModal={openModal} />
          ))}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="خيارات اللعبة"
        >
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute -top-6 -right-5 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-500 mb-6 pr-8">
              ماذا تريد أن تفعل مع
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={closeModalStartOver}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                ابدأ من جديد
              </button>
              <button
                onClick={closeModalResume}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                استئناف
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default GameCategoriesPage;
