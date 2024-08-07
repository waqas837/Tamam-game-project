import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { apiAdd } from "../Api";
import Loader from "./Loader";

const PackageCard = ({ _id, number, text, price, discount, img }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationProps = useSpring({
    transform: inView ? "translateY(0)" : "translateY(50px)",
    opacity: inView ? 1 : 0,
  });

  return (
    <animated.div
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
          <h2 className="text-2xl font-bold text-gray-800">{number}</h2>
          <p className="text-gray-600 text-base">{text}</p>
          <p className="text-xs text-gray-600 mb-2">
            باقة تتيح لك إنشاء {number} {text}
          </p>
          <p className="text-lg font-bold text-gray-800 mb-2">{price} دك</p>
          <button className="w-full bg-orange-400 text-white py-1 px-2 rounded-md hover:bg-orange-500 transition-colors text-sm">
            شراء
          </button>
        </div>
      </div>
    </animated.div>
  );
};

const Packages = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${apiAdd}/user/fetchAllPackages`);
        if (data.success) {
          setPackagesData(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };

    fetchAllPackages();
  }, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div id="pkgs" className="flex flex-wrap -mx-2">
          {loading ? (
            <div className="w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            packagesData.map((pack, index) => (
              <PackageCard key={index} {...pack} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages;
