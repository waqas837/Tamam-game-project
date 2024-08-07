import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { apiUrl } from "../Api";
import Loader from "./Loader";
import { ShoppingBag } from "lucide-react";
import StripeCheckout from "react-stripe-checkout";

const Packages = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [OpenBuySection, setOpenBuySection] = useState(false);
  const [totalPrice, settotalPrice] = useState(0);
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

  const buyPackage = async (pkgId, price) => {
    // setOpenBuySection(true);
    settotalPrice(price);
    // open a modal
    // try {
    //   setLoading(true);
    //   const { data } = await axios.get(`${apiUrl}/user/buypackage/${userid}/${pkgId}`);
    //   if (data.success) {
    //     setPackagesData(data.data);
    //   }
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching packages:", error);
    //   setLoading(false);
    // }
  };
  // var totalPrice = _.sum(state.map((val) => val.price * val.qty));
  const makePayment = (token) => {
    console.log(token);
    //this shows body contains token and
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
      .then((response) => {})
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
                ({ _id, number, text, price, discount, img }, index) => {
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
                          <StripeCheckout
                            stripeKey="pk_test_51IsiGeERaO9lvsvDPuC3K4mxPf0HwBIZXt5bE3f0XArZE6yFTs9ETnr5bOFfhp2hNNM5CImOCzXaIybketwxF6wZ00uzqnWqUP"
                            // name:pass it dynamically
                            token={makePayment}
                            amount={totalPrice * 100}
                            currency="pkr"
                            shippingAddress
                            billingAddress
                          >
                            <button
                              onClick={() => buyPackage(_id, price)}
                              className="w-full bg-orange-400 text-white py-1 px-2 rounded-md hover:bg-orange-500 transition-colors text-sm"
                            >
                              Buy
                            </button>
                          </StripeCheckout>
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
