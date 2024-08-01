import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const textProps = useSpring({
    opacity: textInView ? 1 : 0,
    transform: textInView ? "translateY(0px)" : "translateY(30px)",
    config: { tension: 280, friction: 40 },
  });

  const imageProps = useSpring({
    opacity: imageInView ? 1 : 0,
    transform: imageInView ? "scale(1)" : "scale(1.02)",
    config: { tension: 280, friction: 40 },
  });

  return (
    <div className="relative bg-gradient-to-b from-pink-300 via-pink-200 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col lg:flex-row-reverse items-center">
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
            <animated.div
              style={textProps}
              ref={textRef}
              className="text-center lg:text-right"
            >
              <h1
                className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl"
                dir="ltr"
              >
                <span className="block xl:inline">تحدَّى </span>{" "}
                <span className="block text-pink-600 xl:inline">معرفتك</span>
              </h1>
              <p
                className="mt-3 text-base text-gray-700 sm:mt-4 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-4 md:text-xl lg:mx-0"
                dir="ltr"
              >
                اختر فئة، سمِّ لعبتك، وابدأ اللعب لتختبر مدى معرفتك وتفوقك!
                اكتشف مدى قدرتك على الإجابة الصحيحة في كل جولة. استمتع بتجربة
                ممتعة ومثيرة مع أسئلة متنوعة تلبي جميع اهتماماتك.
              </p>
              <div className="mt-5 sm:mt-6 sm:flex sm:justify-center lg:justify-end">
                <div className="rounded-md shadow">
                  <Link
                    to="/start-game"
                    className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:py-3 md:text-lg md:px-8 focus:ring ring-pink-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                  >
                    <ArrowLeft className="mr-2" />
                    ابدأ اللعب
                  </Link>
                </div>
              </div>
            </animated.div>
          </div>

          <div className="lg:w-1/2 lg:pl-8 w-full">
            <animated.img
              style={imageProps}
              ref={imageRef}
              className="w-full object-cover"
              src="test.png"
              alt="Travel destination"
            />
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <svg
          className="w-full h-12 md:h-16"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
