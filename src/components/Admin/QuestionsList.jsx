import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { apiUrl } from "../../Api";
import axios from "axios";

const QuestionList = () => {
  useEffect(() => {
    getQuestions();
  }, []);

  const [questions, setQuestions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const getQuestions = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/admin/getAllQuestions`);
      if (data.success) {
        const sortedQuestions = data.data.sort((a, b) => b.id - a.id);
        setQuestions(sortedQuestions);

        console.log("data.data", data.data);
      }
    } catch (error) {
      console.log("err in handleSubmit", error);
    }
  };
  const openModal = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setQuestions(
      questions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q))
    );
    closeModal();
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
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
                <tr key={`${q.id}-${val.id}`}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Trash color="#ef4e4e" className="cursor-pointer" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Edit Question
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleEdit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="question"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Question
                          </label>
                          <input
                            type="text"
                            name="question"
                            id="question"
                            value={editingQuestion.question}
                            onChange={(e) =>
                              setEditingQuestion({
                                ...editingQuestion,
                                question: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="points"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Points
                          </label>
                          <select
                            id="points"
                            name="points"
                            value={editingQuestion.points}
                            onChange={(e) =>
                              setEditingQuestion({
                                ...editingQuestion,
                                points: Number(e.target.value),
                              })
                            }
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value={200}>200</option>
                            <option value={400}>400</option>
                            <option value={600}>600</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="answer"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Answer
                          </label>
                          <input
                            type="text"
                            name="answer"
                            id="answer"
                            value={editingQuestion.answer}
                            onChange={(e) =>
                              setEditingQuestion({
                                ...editingQuestion,
                                answer: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={closeModal}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
