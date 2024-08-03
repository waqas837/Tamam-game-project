import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import { apiAdd } from "../../Api";
const AddQuestion = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState(200);
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      // Free memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log({ question, category, points, answer, file });
      let formData = { question, category, points, answer, file };
      await axios.post(`${apiAdd}/admin/postQuestion`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log("err in handleSubmit", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
                  SVG, PNG, JPG, GIF or MP4 (MAX. 800x400px for images)
                </p>
              </div>
              <input
                type="file"
                name="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
            </label>
          </div>
        </div>
        {file && (
          <div>
            <p className="text-lg font-medium text-purple-700 mb-2">
              Uploaded File:
            </p>
            <p className="text-md text-purple-600">{file.name}</p>
            {file.type.startsWith("image/") ? (
              <img
                src={preview}
                alt="Uploaded file preview"
                className="mt-2 max-w-full h-auto rounded-lg shadow-md"
              />
            ) : file.type.startsWith("video/") ? (
              <video
                src={preview}
                className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                controls
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="mt-2 text-purple-600">
                File type not supported for preview.
              </p>
            )}
          </div>
        )}
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
