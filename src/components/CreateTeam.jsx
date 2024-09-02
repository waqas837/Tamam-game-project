import React, { useState } from "react";
import { ArrowUpLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Api";
import toast, { Toaster } from "react-hot-toast";

const CreateGameForm = ({ categoriesIds }) => {
  const [gameName, setGameName] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [team1Score, setTeam1Score] = useState(0); // State for Team 1 Score
  const [team2Score, setTeam2Score] = useState(0); // State for Team 2 Score
  const [gameid, setgameid] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <section className="bg-[url('pathcreategame.png')] bg-no-repeat bg-cover py-12 m-auto text-center p-20">
      <Toaster />
      <h1 className="text-[78px]">حدد معلومات الفرق</h1>
      <input
        type="text"
        className="my-14 border-2 border-[#D140C8] px-8 py-2 rounded-md w-5/12"
        placeholder="اسم اللعبة"
        id="gameName"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      />
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
            <p className="text-[25px] text-pink-500">الفريق الأول</p>

            <input
              type="text"
              className="w-full border-2 px-8 py-2 rounded-md"
              placeholder="اسم اللعبة"
              id="team1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
            />
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
          </div>
          {/* Team 2 */}
          <div className="w-full flex flex-col items-center space-y-4">
            <img src="team.png" alt="" />
            <p className="text-[25px] text-pink-500">الفريق الثاني</p>
            <input
              type="text"
              className="w-full border-2 px-8 py-2 rounded-md"
              placeholder="اسم اللعبة"
              id="team2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
            />
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
          </div>
        </div>
        <div className="my-20 flex justify-center">
          <button
            className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full bg-animate focus:ring-4 ring-yellow-300"
            type="submit"
          >
            <p className="absolute left-20">إنشاء لعبة</p>
            <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
              <ArrowUpLeft />
            </p>
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateGameForm;
