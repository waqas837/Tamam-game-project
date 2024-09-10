import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Api";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook

  // Retrieve URL parameters
  const userId = searchParams.get("userid");
  const price = searchParams.get("price");
  const packageId = searchParams.get("packageId");

  useEffect(() => {
    postPaymentDataToDB();
  }, []);

  // Function to make the API call
  const postPaymentDataToDB = async () => {
    setloading(true);
    try {
      let userData = {
        userid: userId,
        price: price,
        packageId: packageId,
      };

      const { data } = await axios.post(`${apiUrl}/user/transaction`, userData);
      if (data.success) {
        setloading(false);
        setPaymentData(data); // Store the response data in state
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  // Function to navigate to the home page
  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          حالة الدفع
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">
            جارٍ تحميل بيانات الدفع...
          </p>
        ) : (
          <>
            <p className="text-center text-green-600 font-medium mb-4">
              تم الدفع بنجاح. شكرًا لشرائك!
            </p>
            <button
              onClick={handleGoHome}
              className="w-full py-2 px-4 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition duration-300"
            >
              الذهاب إلى الصفحة الرئيسية
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
