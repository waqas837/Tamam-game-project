import { ArrowUpLeft } from "lucide-react";
import React from "react";

const GamesShowDown = () => {
  return (
    <div className="my-36">
      <div className="bg-[url('/Path1658.png')] bg-no-repeat bg-cover">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 p-9">
          <div>
            <h1 className="text-[77px] my-10">اختبر معلوماتك</h1>
            <h2 className="text-[20px] mb-10">
              محتوى تجريبي يمكن استبداله فيما بعد بالمحتوى الفعلى المتفق عليه مع
              فريق وضع وإدارة المحتوى محتوى تجريبي يمكن استبداله فيما بعد
              بالمحتوى الفعلى المتفق عليه
            </h2>
            <button className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full bg-animate focus:ring-4 ring-yellow-300">
              <p className="absolute left-20">إنشاء لعبة</p>
              <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
                <ArrowUpLeft />
              </p>
            </button>
          </div>

          <div>
            <img src="OBJECTS.png" width={"300px"} height={"300px"} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesShowDown;
