import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { apiUrl } from "../Api";

const CategoryCard = ({ category, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const springProps = useSpring({
    transform: isSelected
      ? "scale(1.05)"
      : isHovered
      ? "scale(1.03)"
      : "scale(1)",
    config: { tension: 300, friction: 20 },
  });

  const imageSpringProps = useSpring({
    opacity: isHovered ? 0.7 : 1,
    config: { duration: 200 },
  });

  const descriptionSpringProps = useSpring({
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? "translateY(0)" : "translateY(20px)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div
      style={springProps}
      className={`relative overflow-hidden rounded-lg cursor-pointer `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <animated.img
        style={imageSpringProps}
        src={getImageSrc(category.image)}
        alt={category.name}
        className={`*:w-full object-cover ${
          isSelected ? "border-2 border-yellow-500 rounded-3xl" : ""
        }`}
      />
      <animated.div
        style={descriptionSpringProps}
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <p className="text-white text-sm text-center">{category.description}</p>
      </animated.div>
      <div className="absolute top-2 right-2 flex items-center">
        {/* Yellow "I" icon */}
        <div className="px-2 py-1 mr-2">
          <svg
            id="exclamation-circle-fill"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 30 80"
          >
            <g id="Group_9130" data-name="Group 9130">
              <circle
                id="Ellipse_43"
                data-name="Ellipse 43"
                cx="23.5"
                cy="23.5"
                r="23.5"
                fill="#fff"
              />
              <path
                id="Path_1762"
                data-name="Path 1762"
                d="M47,23.5A23.5,23.5,0,1,1,23.5,0,23.5,23.5,0,0,1,47,23.5ZM23.5,11.75a2.658,2.658,0,0,0-2.644,2.923l1.028,10.3a1.622,1.622,0,0,0,3.231,0l1.028-10.3A2.658,2.658,0,0,0,23.5,11.75Zm.006,17.625a2.938,2.938,0,1,0,2.938,2.938A2.938,2.938,0,0,0,23.506,29.375Z"
                fill="#f5c527"
              />
            </g>
          </svg>
          I
        </div>
        <animated.div
          style={{
            ...useSpring({
              opacity: isSelected ? 1 : 0,
              transform: isSelected ? "scale(1)" : "scale(0.5)",
            }),
          }}
        >
          {/* {isSelected && (
            <div className="bg-blue-500 text-white p-1 rounded-full">
              <Check size={20} />
            </div>
          )} */}
        </animated.div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {category.name}
        </h3>
      </div>
    </animated.div>
  );
};

// Get images url.
const getImageSrc = (imageUrl) => {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  } else {
    return `${apiUrl}/images/${imageUrl}`;
  }
};

const CategorySelection = ({ setcategoriesIds }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/admin/getAllQuestions`);
      if (data.success) {
        setCategories(data.data);
        console.log("data.data", data.data);
      }
    } catch (error) {
      console.log("err in handleSubmit", error);
    }
  };

  const toggleCategory = (id) => {
    let updatedSelectedCategories;

    if (selectedCategories.includes(id)) {
      updatedSelectedCategories = selectedCategories.filter(
        (categoryId) => categoryId !== id
      );
    } else if (selectedCategories.length < 6) {
      updatedSelectedCategories = [...selectedCategories, id];
    } else {
      toast.error("يمكنك اختيار ما يصل إلى 6 فئات فقط.");
      return;
    }

    setSelectedCategories(updatedSelectedCategories);
    setcategoriesIds(updatedSelectedCategories);
  };

  const titleProps = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });

  return (
    <section className="py-16">
      <Toaster />
      <div className="container mx-auto text-center px-4">
        <animated.div style={titleProps}>
          <h1 className="text-[78px] font-bold mb-4">الفئات الدائمه</h1>
        </animated.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              isSelected={selectedCategories.includes(category._id)}
              onClick={() => toggleCategory(category._id)}
            />
          ))}
        </div>
        <animated.div
          style={useSpring({
            opacity: selectedCategories.length > 0 ? 1 : 0,
            transform:
              selectedCategories.length > 0
                ? "translateY(0)"
                : "translateY(20px)",
          })}
          className="mt-12"
        >
          <p className="text-2xl font-semibold text-gray-700">
            الفئات المختارة:{" "}
            <span className="text-pink-500">{selectedCategories.length}/6</span>
          </p>
        </animated.div>
      </div>
    </section>
  );
};

export default CategorySelection;
