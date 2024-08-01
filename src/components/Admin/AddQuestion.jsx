import React, { useState } from "react";
import { Upload } from "lucide-react";

const AddQuestion = () => {
  const [question, setQuestion] = useState("");
  const [points, setPoints] = useState(200);
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ question, points, answer, file });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-br from-pink-100 to-purple-200 text-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">
        Add a New Question
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-lg font-medium text-purple-700">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-purple-700">
            Points
          </label>
          <select
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full p-3 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          >
            {[200, 400, 600].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-purple-700">
            Answer
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-medium text-purple-700">
            Upload Image or Video
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-pink-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-pink-50 transition duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-purple-500" />
                <p className="mb-2 text-sm text-purple-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-purple-500">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition duration-300"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
