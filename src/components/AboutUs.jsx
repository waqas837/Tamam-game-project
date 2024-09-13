import { ArrowUpLeft } from "lucide-react";
import React from "react";

const AboutUs = () => {
  return (
    <div className="my-10">
      <h1 className="text-[78px] text-center my-20">وسائل المساعدة</h1>
      {/* cards */}
      <div className="flex justify-center items-center flex-wrap gap-4">
        <div className="w-[300px] my-5 h-[481px] p-10 bg-gray-100 rounded-xl text-center">
          {/* image */}
          <img src="rating.png" width={"170px"} height={"170px"} alt="" />
          <h1 className="my-5">الاجابه ×٢</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="1"
            viewBox="0 0 54 1"
            className="m-auto my-5"
          >
            <path
              id="Path_1650"
              data-name="Path 1650"
              d="M0,0H54"
              transform="translate(0 0.5)"
              fill="none"
              stroke="#099bff"
              stroke-width="1"
            />
          </svg>
          <p className="text-[13px] my-9">محتوى تجريبي لشرح وسيلة المساعدة</p>
          <button className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full focus:ring-4 ring-yellow-300">
            <p className="absolute left-20">إنشاء لعبة</p>
            <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
              <ArrowUpLeft />
            </p>
          </button>
        </div>

        <div className="w-[300px] my-5 h-[481px] p-10 bg-gray-100 rounded-xl text-center">
          {/* image */}
          <img
            src="lightbulb.png"
            className="m-auto"
            width={"170px"}
            height={"170px"}
            alt=""
          />
          <h1 className="my-5">هينت</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="1"
            viewBox="0 0 54 1"
            className="m-auto my-5"
          >
            <path
              id="Path_1650"
              data-name="Path 1650"
              d="M0,0H54"
              transform="translate(0 0.5)"
              fill="none"
              stroke="#099bff"
              stroke-width="1"
            />
          </svg>
          <p className="text-[13px] my-9">محتوى تجريبي لشرح وسيلة المساعدة</p>
          <button className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full focus:ring-4 ring-yellow-300">
            <p className="absolute left-20">إنشاء لعبة</p>
            <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
              <ArrowUpLeft />
            </p>
          </button>
        </div>

        <div className="w-[300px] my-5 h-[481px] p-10 bg-gray-100 rounded-xl text-center">
          {/* image */}
          <img src="answer.png" width={"170px"} height={"170px"} alt="" />
          <h1 className="my-5">عدم اجابه الفريق الاخر</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="1"
            viewBox="0 0 54 1"
            className="m-auto my-5"
          >
            <path
              id="Path_1650"
              data-name="Path 1650"
              d="M0,0H54"
              transform="translate(0 0.5)"
              fill="none"
              stroke="#099bff"
              stroke-width="1"
            />
          </svg>
          <p className="text-[13px] my-9">محتوى تجريبي لشرح وسيلة المساعدة</p>
          <button className="group relative flex items-center justify-between bg-yellow-400 text-black px-28 py-7 rounded-full focus:ring-4 ring-yellow-300">
            <p className="absolute left-20">إنشاء لعبة</p>
            <p className="group-hover:bg-blue-500 absolute left-1 bg-black rounded-full text-white p-3">
              <ArrowUpLeft />
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
