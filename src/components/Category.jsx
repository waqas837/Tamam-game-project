import React, { useState } from "react";
import Cards from "./Cards";

function Category() {
  const categories = [
    { id: 1, name: "Social", desc: "This contains social questions." },
    { id: 2, name: "Technical", desc: "This contains technical questions." },
    {
      id: 3,
      name: "General Knowledge",
      desc: "This contains general knowledge questions.",
    },
    { id: 4, name: "Health", desc: "This contains health-related questions." },
    { id: 5, name: "Science", desc: "This contains science questions." },
    { id: 6, name: "Sports", desc: "This contains sports-related questions." },
    { id: 7, name: "Arts", desc: "This contains questions about arts." },
    { id: 8, name: "Literature", desc: "This contains literature questions." },
    { id: 9, name: "History", desc: "This contains history questions." },
    {
      id: 10,
      name: "Entertainment",
      desc: "This contains entertainment questions.",
    },
    { id: 11, name: "Geography", desc: "This contains geography questions." },
    { id: 12, name: "Politics", desc: "This contains political questions." },
    {
      id: 13,
      name: "Philosophy",
      desc: "This contains philosophical questions.",
    },
    {
      id: 14,
      name: "Religion",
      desc: "This contains questions about religion.",
    },
    { id: 15, name: "Nature", desc: "This contains questions about nature." },
    {
      id: 16,
      name: "Technology",
      desc: "This contains technology-related questions.",
    },
    {
      id: 17,
      name: "Business",
      desc: "This contains business-related questions.",
    },
    { id: 18, name: "Economy", desc: "This contains economic questions." },
    { id: 19, name: "Law", desc: "This contains legal questions." },
    { id: 20, name: "Math", desc: "This contains math-related questions." },
  ];

  return (
    <div>
      <div className="fonts categories text-center">
        <h2 className="text-3xl font-bold text-pink-500 mb-6">
          Choose a Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-10">
          {categories.map((val, index) => (
            <div key={index}>
              <Cards name={val.name} desc={val.desc} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Category;
