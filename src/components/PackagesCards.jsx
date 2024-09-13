import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { apiUrl } from "../Api";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import LoaderTwo from "./LoaderTwo";

const Packages = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let loggedInUser = localStorage.getItem("user");
  let currentUsePkg = localStorage.getItem("boughtpkg");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
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
        console.log("data.data)", data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setLoading(false);
    }
  };

  const buyPackage = async (pkgId, price, pckgName) => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) toast("Please Login");
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
  const tryCharge = async (id, price) => {
    let loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      toast.error("يرجى تسجيل الدخول أولاً.");
      return;
    }
    let loggedInUserData = JSON.parse(localStorage.getItem("user"));
    toast.loading("Processing");
    const options = {
      method: "POST",
      url: "https://sandboxapi.upayments.com/api/v1/charge",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer jtest123",
      },
      data: {
        order: {
          id: "202210101202210123",
          reference: "202210101",
          description: "Test product",
          currency: "KWD",
          amount: price,
        },
        language: "en",
        paymentGateway: { src: "knet" },
        reference: { id: "ord_000000101121012121211231212" },
        customer: {
          uniqueId: loggedInUser._id,
          name: loggedInUser.firstName + " " + loggedInUser.lastName,
          email: loggedInUser.email,
          mobile: loggedInUser.phone,
        },
        returnUrl: `http://localhost:5173/payment/?userid=${loggedInUserData._id}&price=${price}&packageId=${id}`,
        cancelUrl: "https://www.yourwebsite.com/cancel",
        notificationUrl: "https://www.yourwebsite.com/notification",
      },
    };

    axios
      .request(options)
      .then(async function (response) {
        toast.dismiss();
        let link = response.data.data.link;
        console.log(response.data);
        window.location.href = link;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  return (
    <div className="bg-[url('/cardsbg.png')] bg-no-repeat bg-cover text-white m-auto text-center p-32">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[36px] mb-5">باقات الألعاب</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="54"
          height="1"
          viewBox="0 0 54 1"
          className="m-auto"
        >
          <line
            id="Line_53"
            data-name="Line 53"
            x1="54"
            transform="translate(0 0.5)"
            fill="none"
            stroke="#efefef"
            stroke-width="1"
          />
        </svg>
        <h2 className="text-[18px]  my-5">
          لكل مستخدم لعبة واحدة مجانية يمكنك من خلالها تجربة الفئات الموجودة
        </h2>
        <div id="pkgs" className="relative flex flex-wrap -mx-2">
          {loading ? (
            <div className="w-full flex justify-center items-center">
              <LoaderTwo />
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
                      <div
                        style={{ backgroundImage: `url(${img})` }}
                        className="bg-no-repeat bg-contain bg-top text-white m-auto text-center h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg relative flex flex-col justify-end"
                      >
                        {/* Optional: Discount or other content */}
                        <button
                          onClick={() => tryCharge(_id, price)}
                          className="bg-yellow-500 p-2 md:p-3 text-xs md:text-base rounded-full focus:ring-2 ring-yellow-200 -mb-4 mx-auto"
                        >
                          شراء
                        </button>
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
