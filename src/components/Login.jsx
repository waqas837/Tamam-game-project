// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { apiUrl } from "../Api"; // Assuming this is correctly defined in your Api.js

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
//       return;
//     }

//     try {
//       const response = await fetch(`${apiUrl}/user/signin`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (response.ok && data.success) {
//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("boughtpkg", data.user.currentPackage);
//         navigate("/start-game");
//       } else {
//         setError(
//           data.message ||
//             "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك."
//         );
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       setError("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقًا.");
//     }
//   };

//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen flex items-center justify-center bg-gray-100"
//     >
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">
//           تسجيل الدخول
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="email">
//               البريد الإلكتروني
//             </label>
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="أدخل بريدك الإلكتروني"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 mb-2" htmlFor="password">
//               كلمة المرور
//             </label>
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="أدخل كلمة المرور"
//               required
//             />
//           </div>
//           {error && (
//             <div className="text-red-500 text-center mb-4">{error}</div>
//           )}
//           <button
//             type="submit"
//             className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition duration-300"
//           >
//             تسجيل الدخول
//           </button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           ليس لديك حساب؟{" "}
//           <Link to="/signup" className="text-pink-600 hover:underline">
//             إنشاء حساب
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
