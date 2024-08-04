import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Check } from "lucide-react";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { apiAdd } from "../Api";

const CategoryCard = ({ category, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const springProps = useSpring({
    transform: isSelected
      ? "scale(1.05)"
      : isHovered
      ? "scale(1.03)"
      : "scale(1)",
    boxShadow: isSelected
      ? "0 10px 20px rgba(220, 38, 38, 0.2)"
      : isHovered
      ? "0 5px 15px rgba(0, 0, 0, 0.1)"
      : "0 2px 10px rgba(0, 0, 0, 0.05)",
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
      className={`relative overflow-hidden rounded-lg cursor-pointer ${
        isSelected ? "ring-4 ring-pink-500 bg-pink-50" : "bg-white"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <animated.img
        style={imageSpringProps}
        src={getImageSrc(category.image)}
        alt={category.name}
        className="w-full h-48 object-cover"
      />
      <animated.div
        style={descriptionSpringProps}
        className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4"
      >
        <p className="text-white text-sm text-center">{category.description}</p>
      </animated.div>
      <div className="absolute top-2 right-2">
        <animated.div
          style={{
            ...useSpring({
              opacity: isSelected ? 1 : 0,
              transform: isSelected ? "scale(1)" : "scale(0.5)",
            }),
          }}
        >
          {isSelected && (
            <div className="bg-pink-500 text-white p-1 rounded-full">
              <Check size={20} />
            </div>
          )}
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
  // Check if the image URL contains 'http' or 'https' indicating an external link
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl; // Return the external URL directly
  } else {
    return `${apiAdd}/images/${imageUrl}`; // Return local URL
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
      let { data } = await axios.get(`${apiAdd}/admin/getAllQuestions`);
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
      // Remove the category from the selection
      updatedSelectedCategories = selectedCategories.filter(
        (categoryId) => categoryId !== id
      );
    } else if (selectedCategories.length < 6) {
      // Add the category to the selection, but only if less than 6 are selected
      updatedSelectedCategories = [...selectedCategories, id];
    } else {
      toast.error("يمكنك اختيار ما يصل إلى 6 فئات فقط.");
      return; // Exit if the user tried to select more than 6 categories
    }

    setSelectedCategories(updatedSelectedCategories);
    setcategoriesIds(updatedSelectedCategories); // Update the parent state with the new selection
  };

  const titleProps = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });

  return (
    <section className="py-16 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Toaster />
      <div className="container mx-auto text-center px-4">
        <animated.div style={titleProps}>
          <h1 className="text-5xl font-bold mb-4 text-pink-600 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            اختر فئاتك المفضلة
          </h1>
          <p className="text-xl mb-12 text-gray-600">
            حدد حتى 6 فئات لتخصيص تجربتك الفريدة
          </p>
        </animated.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
