import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const handleGotoCreateGame = () => {
    let loggedInUser = localStorage.getItem("user");
    console.log("loggedInUser", loggedInUser);
    if (!loggedInUser) {
      toast.error("يرجى تسجيل الدخول أولاً.");
      return;
    }
    navigate("/start-game");
  };
  const browseGames = () => {
    let loggedInUser = localStorage.getItem("user");
    console.log("loggedInUser", loggedInUser);
    if (!loggedInUser) {
      toast.error("يرجى تسجيل الدخول أولاً.");
      return;
    }
    navigate("/my-games");
  };
  return (
    <div className="bg-[url('/bg.png')] bg-no-repeat bg-cover text-white m-auto text-center p-6">
      <Toaster />
      <section className="py-52">
        <h1 className="text-[140px] font-bold my-10">اعصر مُخك</h1>
        <h2 className="text-[40px] my-10">الجواب عليك، و السؤال علينا</h2>
        <h3 className="text-[18px] my-10">
          محتوى تجريبي يمكن استبداله فيما بعد بالمحتوى الفعلى المتفق عليه مع
          فريق وضع المحتوى
        </h3>
        {/* buttons */}
        <div className="flex justify-center my-10 flex-wrap gap-8">
          <button
            onClick={() => handleGotoCreateGame()}
            className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full bg-animate focus:ring-4 ring-yellow-300"
          >
            <p className="absolute left-20">إنشاء لعبة</p>
            <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
              <ArrowUpLeft />
            </p>
          </button>
          <button
            onClick={() => browseGames()}
            className="relative flex items-center justify-between bg-white text-black px-28 py-7 rounded-full"
          >
            <p className="absolute left-20">تصفح الألعاب</p>
            <p className="absolute left-1 bg-blue-500 rounded-full text-white p-3">
              <ArrowLeft />
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
