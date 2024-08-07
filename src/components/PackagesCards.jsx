import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { apiUrl } from "../Api";
import Loader from "./Loader";
import { ShoppingBag } from "lucide-react";
import StripeCheckout from "react-stripe-checkout";
import { useNavigate } from "react-router-dom";

const Packages = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let loggedInUser = localStorage.getItem("user");
  let currentUsePkg = localStorage.getItem("boughtpkg");
  console.log("currentUsePkg", currentUsePkg);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationProps = useSpring({
    transform: inView ? "translateY(0)" : "translateY(50px)",
    opacity: inView ? 1 : 0,
  });
  useEffect(() => {
    fetchAllPackages();
  }, []);
  const fetchAllPackages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/user/fetchAllPackages`);
      if (data.success) {
        setPackagesData(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setLoading(false);
    }
  };

  const buyPackage = async (pkgId, price, pckgName) => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) navigate("/login");
    localStorage.setItem("pkgId", pkgId);
    localStorage.setItem("pckgName", pckgName);
    localStorage.setItem("price", price);
  };
  // After buy a package by this user we will update the database for buy it more games
  const orderConfirmed = async () => {
    try {
      let loggedInUser = localStorage.getItem("user");
      loggedInUser = JSON.parse(loggedInUser);
      let PackagesId = localStorage.getItem("pkgId");
      let PackagesName = localStorage.getItem("pckgName");
      let Price = localStorage.getItem("price");
      setLoading(true);
      const { data } = await axios.post(
        `${apiUrl}/user/buypackage/${loggedInUser._id}/${PackagesId}/${PackagesName}`
      );
      if (data.success) {
        localStorage.setItem("boughtpkg", data.data.currentPackage);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setLoading(false);
    }
  };
  const makePayment = (token) => {
    console.log(token);
    //this shows body contains token and
    let totalPrice = localStorage.getItem("price");
    const body = {
      token,
      totalPrice,
    };
    //inside the headers we have our content type will be json
    const headers = {
      "Content-Type": "application/json",
    };
    //if we use the axios then we don't need to pass these credetials alright..
    fetch(`${apiUrl}/user/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        console.log("res", response);
        if (response.ok && response.status === 200) {
          await orderConfirmed();
        }
      })
      .catch((err) => console.log(`err is here: ${err}`));
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div id="pkgs" className="flex flex-wrap -mx-2">
          {loading ? (
            <div className="w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {packagesData.map(
                ({ _id, number, name, text, price, discount, img }, index) => {
                  return (
                    <animated.div
                      key={_id || index}
                      style={animationProps}
                      ref={ref}
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                    >
                      <div className="relative bg-white rounded-3xl shadow-md overflow-hidden h-full">
                        <img src={img} alt="" className="w-full object-cover" />
                        {discount && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                            {discount}% خصم
                          </div>
                        )}
                        <div className="p-3">
                          <h2 className="text-2xl font-bold text-gray-800">
                            {number}
                          </h2>
                          <p className="text-gray-600 text-base">{text}</p>
                          <p className="text-xs text-gray-600 mb-2">
                            باقة تتيح لك إنشاء {number} {text}
                          </p>
                          <p className="text-lg font-bold text-gray-800 mb-2">
                            {price} دك
                          </p>
                          {loggedInUser ? (
                            <StripeCheckout
                              stripeKey="pk_test_51IsiGeERaO9lvsvDPuC3K4mxPf0HwBIZXt5bE3f0XArZE6yFTs9ETnr5bOFfhp2hNNM5CImOCzXaIybketwxF6wZ00uzqnWqUP"
                              // name:pass it dynamically
                              token={makePayment}
                              amount={price}
                              currency="USD"
                              shippingAddress
                              billingAddress
                            >
                              <button
                                onClick={() => buyPackage(_id, price, name)}
                                className={`w-full py-1 px-2 rounded-md transition-colors text-sm 
                                  ${
                                    currentUsePkg.includes(name)
                                      ? "bg-gray-400 text-white cursor-not-allowed"
                                      : "bg-orange-400 text-white hover:bg-orange-500"
                                  }`}
                                disabled={currentUsePkg.includes(name)}
                              >
                                {currentUsePkg.includes(name)
                                  ? "Purchased"
                                  : "Buy"}
                              </button>
                            </StripeCheckout>
                          ) : (
                            <button
                              onClick={() => navigate("/login")}
                              className="w-full bg-orange-400 text-white py-1 px-2 rounded-md hover:bg-orange-500 transition-colors text-sm"
                            >
                              Buy
                            </button>
                          )}
                        </div>
                      </div>
                    </animated.div>
                  );
                }
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages;
