import React from "react";
import { ArrowLeft } from "lucide-react";
import "./Home.css";
const HeroSection = () => {
  return (
    <div className="bottomShape bg-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse items-center py-12 lg:py-20">
          {/* Content Section */}
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
            <div className="text-center lg:text-right">
              <h1
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                dir="ltr"
              >
                <span className="block xl:inline">تحدَّى </span>{" "}
                <span className="block text-pink-600 xl:inline">معرفتك</span>
              </h1>
              <p
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                dir="ltr"
              >
                اختر فئة، سمِّ لعبتك، وابدأ اللعب لتختبر مدى معرفتك وتفوقك!
                اكتشف مدى قدرتك على الإجابة الصحيحة في كل جولة. استمتع بتجربة
                ممتعة ومثيرة مع أسئلة متنوعة تلبي جميع اهتماماتك. احصل على فرصة
                لتحدي أصدقائك ومعرفة من هو الأذكى، واكسب النقاط والمكافآت بينما
                تتقدم في اللعبة.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-end">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:py-4 md:text-lg md:px-10 focus:ring ring-pink-400"
                  >
                    <ArrowLeft className="mr-2" />
                    ابدأ اللعب
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 lg:pl-8 w-full">
            <img
              className="w-full h-64 sm:h-72 md:h-96 lg:h-full object-cover rounded-lg shadow-lg"
              src="test.jpg"
              alt="Travel destination"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
