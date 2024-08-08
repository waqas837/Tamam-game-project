import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { X } from "lucide-react";
import { apiUrl } from "../Api";
import Loader from "./Loader";

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
  <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
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
  <div onClick={() => openModal(val._id, val.GameName)}>
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

  useEffect(() => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    }
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
      if (data.success) {
        setCategories(data.YourGames);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("err in handleSubmit", error);
    }
  };

  const openModal = (gameId, gameName) => {
    setCurrentGameId(gameId);
    setCurrentGameName(gameName);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentGameId(null);
    setCurrentGameName(null);
  };

  const closeModalStartOver = async () => {
    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    setModalIsOpen(false);
    await axios.post(
      `${apiUrl}/user/startovergame/${loggedInUser._id}/${currentGameId}`
    );
    // You might want to refresh the games list or navigate to a new page here
    getQuestions(); // Refresh the games list
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
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-8">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-12 shadow-text">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pr-8">
            ماذا تريد أن تفعل مع {currentGameName}؟
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
  );
};

export default GameCategoriesPage;
