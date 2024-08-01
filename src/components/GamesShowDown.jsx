import React from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";

// Define the GameCard component with animation
const GameCard = ({ gamesAvailable }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1, // Trigger animation when 10% of the component is visible
  });

  const props = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translateY(0px) scale(1)"
      : "translateY(20px) scale(0.95)",
    config: { tension: 280, friction: 60 },
  });

  return (
    <animated.div
      ref={ref}
      style={props}
      className="w-full max-w-sm border-2 rounded-lg shadow-lg p-6 m-4 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-opacity-60 backdrop-blur-lg backdrop-brightness-90"
    >
      <div className="text-center text-white">
        <p className="text-2xl font-bold mb-4">عدد الألعاب الحاليه</p>
        <p className="text-4xl font-extrabold mb-4">{gamesAvailable}</p>
        <p className="text-lg">
          لا يمكنك اللعب أكثر من مرة واحدة. يرجى شراء خطة لزيادة عدد الألعاب
          المتاحة.
        </p>
      </div>
    </animated.div>
  );
};

// Main component that renders the GameCard
const GameShowdown = () => {
  const gamesAvailable = 1; // Current number of available games

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-pink-600">
          عدد الألعاب الحاليه
        </h1>
        <div className="flex justify-center">
          {/* Use the GameCard component to display game info */}
          <GameCard gamesAvailable={gamesAvailable} />
        </div>
      </div>
    </section>
  );
};

export default GameShowdown;
