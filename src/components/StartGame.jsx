import React, { useState } from "react";
import Categories from "./Category";
import CreateTeam from "./CreateTeam";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameInstructions = () => {
  const [categoriesIds, setcategoriesIds] = useState([]);
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[url('/bg.png')] bg-no-repeat bg-cover text-white m-auto text-center p-6">
        <section className="py-52">
          <h1 className="text-[140px] font-bold my-10">إنشاء لعبة</h1>
          <h2 className="text-[40px] my-10">
            لعبة جماعية تفاعلية نختبر فيها معرفتكم و ثقافتكم
          </h2>
          <h3 className="text-[18px] my-10">
            محتوى تجريبي يمكن استبداله فيما بعد بالمحتوى الفعلى المتفق عليه مع
            فريق وضع المحتوى
          </h3>
          {/* buttons */}
          <div className="flex justify-center my-10 flex-wrap gap-8">
            <button
              onClick={() => navigate("/my-games")}
              className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full bg-animate focus:ring-4 ring-yellow-300"
            >
              <p className="absolute left-20">ألعابي</p>
              <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
                <ArrowUpLeft />
              </p>
            </button>
            <button
              onClick={() => {
                navigate("/start-game"); // Navigate to the correct page first
                const element = document.getElementById("createTeam");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="relative flex items-center justify-between bg-white text-black px-28 py-7 rounded-full"
            >
              <p className="absolute left-20">لعبة جديدة</p>
              <p className="absolute left-1 bg-blue-500 rounded-full text-white p-3">
                <ArrowLeft />
              </p>
            </button>
          </div>
        </section>
      </div>
      {/* Categories */}
      <Categories setcategoriesIds={setcategoriesIds} />
      {/* Create teams */}
      <div id="createTeam">
        <CreateTeam categoriesIds={categoriesIds} />
      </div>
    </>
  );
};

export default GameInstructions;
