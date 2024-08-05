import React from "react";
import { useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { CheckCircle } from "lucide-react";

const Result = () => {
  const location = useLocation();
  const { results } = location.state;

  // Animation for the card
  const cardSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 220, friction: 20 },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <animated.div
        style={cardSpring}
        className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-pink-500 text-center mb-4">
          Game Results
        </h1>
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-pink-500 mx-auto mb-2" />
          <p className="text-lg text-gray-700">
            <span className="font-semibold">{results}</span>
          </p>
        </div>
      </animated.div>
    </div>
  );
};

export default Result;
