import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { apiUrl } from "../../Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";

Modal.setAppElement("#root");

const QuestionList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/admin/getAllUsers`);
      if (data.success) {
        const sortedUsers = data.data.sort((a, b) => b.id - a.id);
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.log("خطأ في الحصول على الأسئلة", error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/admin/deleteUser`, {
        data: { userId: selectedItem.userId },
      });
      if (response.data.success) {
        toast.success("تم حذف السؤال.");
        getUsers();
        closeModal();
      }
    } catch (error) {
      console.log("خطأ في حذف السؤال:", error);
    }
  };

  const openModal = (userId) => {
    setSelectedItem({ userId });
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
      width: "90%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-8">
      <Toaster />
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-pink-600">
        Users List
      </h2>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Games
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Money Spent
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((val) => (
              <tr key={`${val._id}`}>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-normal text-right text-sm">
                  {val._id}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm">
                  {val.email}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-normal text-right text-sm">
                  {val.myHostGames.length}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm">
                  {val.moneySpent ? val.moneySpent : "0 KD"}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right relative text-sm">
                  <button onClick={() => openModal(val._id)}>
                    <Trash color="#ef4e4e" className="cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="تحذير: حذف المستخدم نهائيًا"
      >
        <h2 className="text-xl font-bold mb-4">تحذير: حذف المستخدم نهائيًا</h2>
        <button
          onClick={deleteUser}
          className="block w-full text-center px-4 py-2 mb-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
        >
          يتأكد
        </button>

        <button
          onClick={closeModal}
          className="block w-full px-4 py-2 text-sm text-center text-gray-800 bg-gray-200 hover:bg-gray-300 rounded"
        >
          إلغاء
        </button>
      </Modal>
    </div>
  );
};

export default QuestionList;
