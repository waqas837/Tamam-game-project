import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../Api";
import toast, { Toaster } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setError("");

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("admin", JSON.stringify(data.user));
        localStorage.setItem("userType", "admin");
        localStorage.setItem("token", data.token);
        setloading(false);
        navigate("/admin/add-question");
      } else if (data.success === false) {
        setloading(false);
        toast.error("بيانات الاعتماد غير صحيحة");
        setError(
          data.message ||
            "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك."
        );
      }
    } catch (error) {
      console.error("فشل تسجيل الدخول:", error);
      setError("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقاً.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 to-pink-600">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          تسجيل دخول الإدارة
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">اسم المستخدم</label>
            <input
              type="text"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg border-gray-300"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg border-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
          >
            {loading ? "..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
