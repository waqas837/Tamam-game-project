import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { apiUrl } from "../../Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";
// Set the app element for accessibility
Modal.setAppElement("#root");

const QuestionList = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/admin/getAllQuestions`);
      if (data.success) {
        const sortedQuestions = data.data.sort((a, b) => b.id - a.id);
        setQuestions(sortedQuestions);
      }
    } catch (error) {
      console.log("err in getQuestions", error);
    }
  };

  const deleteQuestion = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/admin/deleteQuestion`, {
        data: { questionId: selectedItem.questionId },
      });
      if (response.data.success) {
        toast.success("Question deleted.");
        getQuestions(); // Refresh the question list
        closeModal();
      }
    } catch (error) {
      console.log("Error deleting question:", error);
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/admin/deleteCategory`, {
        data: { categoryId: selectedItem.categoryId },
      });
      if (response.data.success) {
        toast.success("Category deleted.");
        getQuestions(); // Refresh the question list
        closeModal();
      }
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };

  const openModal = (questionId, categoryId) => {
    setSelectedItem({ questionId, categoryId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "300px",
      width: "100%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Toaster />
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-600">
        Question List
      </h2>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto rtl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Answer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((q) =>
              q.questions.map((val) => (
                <tr key={`${q._id}-${val._id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {val.question}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {val.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {val.answer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {q.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button onClick={() => openModal(val._id, q._id)}>
                      <Trash color="#ef4e4e" className="cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Delete Options"
      >
        <h2 className="text-xl font-bold mb-4">Delete Options</h2>
        <button
          onClick={deleteQuestion}
          className="block w-full px-4 py-2 mb-2 text-sm text-left text-white bg-red-500 hover:bg-red-600 rounded"
        >
          Delete Question
        </button>
        <button
          onClick={deleteCategory}
          className="block w-full px-4 py-2 mb-4 text-sm text-left text-white bg-red-500 hover:bg-red-600 rounded"
        >
          Delete Category
        </button>
        <button
          onClick={closeModal}
          className="block w-full px-4 py-2 text-sm text-center text-gray-800 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default QuestionList;
