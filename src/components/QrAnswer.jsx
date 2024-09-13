import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import socket from "../socket";

const QrAnswer = () => {
  const [answer, setanswer] = useState();
  const { teamName } = useParams();
  const submitAnswer = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(teamName, answer);
      socket.emit("answer", { teamName, answer });
      setanswer("");
      toast.success("Answer Submitted");
      window.close();
    } catch (error) {
      toast.error("Failed to submit answer");
      console.log("error", error);
    }
  };
  return (
    <div className="text-center m-auto">
      <Toaster />
      <form onSubmit={submitAnswer}>
        <h1 className="text-[78px]">Enter Your Answer </h1>
        <input
          type="text"
          className="my-14 border-2 border-[#D140C8] px-8 py-2 rounded-md w-5/12"
          placeholder="Enter answer"
          id="gameName"
          onChange={(e) => setanswer(e.target.value)}
          required
        />
        <button
          type="submit"
          className="m-auto group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full focus:ring-4 ring-yellow-300"
        >
          <p className="absolute left-20">Submit</p>
        </button>
      </form>
    </div>
  );
};

export default QrAnswer;
