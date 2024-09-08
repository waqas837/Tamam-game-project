import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../Api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCategoryAndQuestions = () => {
  const [category, setCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(
    Array(6).fill({
      question: "",
      answer: "",
      file: null,
      answerDocument: null,
      points: 200,
    })
  );

  useEffect(() => {
    let isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
  }, []);

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
    console.log("newQuestions", newQuestions)
    setQuestions(newQuestions);
  };

  const handleFileChange = (index, e, fileType) => {
    const file = e.target.files[0];
    console.log({index, fileType, file})
    handleQuestionChange(index, fileType, file);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("categoryImage", categoryImage);

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
        console.log("questions", questions)
      questions.forEach((q) => {
        if (q.file) {
          console.log("q.file", q.file)
          formData.append(`questionFiles`, q.file);
        }
        if (q.answerDocument) {
          console.log("q.answerDocument", q.answerDocument)
          formData.append(`answerDocument`, q.answerDocument);
        }
      });

      await axios.post(`${apiUrl}/admin/postQuestion`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم إرسال الفئة والأسئلة بنجاح!");
      setloading(false);
    } catch (error) {
      console.error("Error in handleSubmit", error);
      toast.error("حدث خطأ أثناء إرسال النموذج.");
      setloading(false);
    }
  };


  // Function to add a new question field
  const addQuestionField = () => {
    setQuestions([
      ...questions,
      { question: "", answer: "", file: null, answerDocument: null, points: 200 },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-br from-pink-100 to-purple-200 text-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">
        إضافة فئة وأسئلة
      </h2>
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-lg font-medium text-purple-700">
            فئة
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
            صورة الفئة
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
              سؤال {index + 1}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-md font-medium text-purple-700">
                  سؤال
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
                  إجابة
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
                  نقاط
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
                  تحميل صورة أو فيديو
                </label>
                <input
                  name="questionFiles"
                  type="file"
                  onChange={(e) => handleFileChange(index, e, "file")}
                  className="w-full p-2 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                />
              </div>
              {/* answer docoment */}
              <div>
                <label className="block mb-2 text-md font-medium text-purple-700">
                  Answer Document Optional
                </label>
                <input
                  name="answerDocument"
                  type="file"
                  onChange={(e) => handleFileChange(index, e, "answerDocument")}
                  className="w-full p-2 border-2 border-pink-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={addQuestionField}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
          >
            + أضف سؤال
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition duration-300"
        >
          {loading ? "جارٍ التحميل..." : "إرسال الفئة والأسئلة"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryAndQuestions;
