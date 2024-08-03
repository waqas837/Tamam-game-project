import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import { apiAdd } from "../../Api";

const AddCategoryAndQuestions = () => {
  const [category, setCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [questions, setQuestions] = useState(
    Array(6).fill({
      question: "",
      answer: "",
      file: null,
      points: 200,
    })
  );

  useEffect(() => {
    questions.forEach((_, index) => {
      if (questions[index].file) {
        const objectUrl = URL.createObjectURL(questions[index].file);
        return () => URL.revokeObjectURL(objectUrl);
      }
    });
  }, [questions]);

  const handleCategoryImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    handleQuestionChange(index, "file", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("categoryImage", categoryImage);

      // Append questions as a JSON string
      formData.append(
        "questions",
        JSON.stringify(
          questions.map((q) => ({
            question: q.question,
            answer: q.answer,
            points: q.points,
          }))
        )
      );

      // Append question files
      questions.forEach((q, index) => {
        if (q.file) {
          formData.append(`questionFiles`, q.file);
        }
      });

      await axios.post(`${apiAdd}/admin/postQuestion`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Category and questions submitted successfully!");
    } catch (error) {
      console.error("Error in handleSubmit", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-br from-pink-100 to-purple-200 text-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">
        Add Category and Questions
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            Category Image
          </label>
          <input
            name="categoryImage"
            type="file"
            onChange={handleCategoryImageChange}
            className="w-full p-3 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            accept="image/*"
            required
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="border-2 border-pink-300 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              Question {index + 1}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-md font-medium text-purple-700">
                  Question
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  className="w-full p-2 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-md font-medium text-purple-700">
                  Answer
                </label>
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) =>
                    handleQuestionChange(index, "answer", e.target.value)
                  }
                  className="w-full p-2 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-md font-medium text-purple-700">
                  Points
                </label>
                <select
                  value={q.points}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "points",
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-2 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value={200}>200</option>
                  <option value={400}>400</option>
                  <option value={600}>600</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-md font-medium text-purple-700">
                  Upload Image or Video
                </label>
                <input
                  name="questionFiles"
                  type="file"
                  onChange={(e) => handleFileChange(index, e)}
                  className="w-full p-2 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  accept="image/*,video/*"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition duration-300"
        >
          Submit Category and Questions
        </button>
      </form>
    </div>
  );
};

export default AddCategoryAndQuestions;
