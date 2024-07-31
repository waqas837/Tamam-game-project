import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const categories = [
  {
    id: 1,
    name: "Sports",
    image: "https://via.placeholder.com/150?text=Sports",
    description: "All about various sports",
  },
  {
    id: 2,
    name: "Technology",
    image: "https://via.placeholder.com/150?text=Technology",
    description: "Latest in tech and gadgets",
  },
  {
    id: 3,
    name: "Music",
    image: "https://via.placeholder.com/150?text=Music",
    description: "Explore different genres and artists",
  },
  {
    id: 4,
    name: "Movies",
    image: "https://via.placeholder.com/150?text=Movies",
    description: "Everything related to films and cinema",
  },
  {
    id: 5,
    name: "Food",
    image: "https://via.placeholder.com/150?text=Food",
    description: "Delicious recipes and culinary tips",
  },
  {
    id: 6,
    name: "Travel",
    image: "https://via.placeholder.com/150?text=Travel",
    description: "Destinations and travel experiences",
  },
  {
    id: 7,
    name: "Health",
    image: "https://via.placeholder.com/150?text=Health",
    description: "Tips for a healthy lifestyle",
  },
  {
    id: 8,
    name: "Education",
    image: "https://via.placeholder.com/150?text=Education",
    description: "Learning resources and tips",
  },
  {
    id: 9,
    name: "Business",
    image: "https://via.placeholder.com/150?text=Business",
    description: "Insights and strategies for businesses",
  },
  {
    id: 10,
    name: "Science",
    image: "https://via.placeholder.com/150?text=Science",
    description: "Discoveries and research in science",
  },
  {
    id: 11,
    name: "Art",
    image: "https://via.placeholder.com/150?text=Art",
    description: "Creative arts and expressions",
  },
  {
    id: 12,
    name: "Fashion",
    image: "https://via.placeholder.com/150?text=Fashion",
    description: "Trends and styles in fashion",
  },
  {
    id: 13,
    name: "History",
    image: "https://via.placeholder.com/150?text=History",
    description: "Historical events and figures",
  },
  {
    id: 14,
    name: "Gaming",
    image: "https://via.placeholder.com/150?text=Gaming",
    description: "Video games and gaming culture",
  },
  {
    id: 15,
    name: "Politics",
    image: "https://via.placeholder.com/150?text=Politics",
    description: "Political news and analysis",
  },
  {
    id: 16,
    name: "Finance",
    image: "https://via.placeholder.com/150?text=Finance",
    description: "Financial tips and market insights",
  },
  {
    id: 17,
    name: "Environment",
    image: "https://via.placeholder.com/150?text=Environment",
    description: "Environmental issues and solutions",
  },
  {
    id: 18,
    name: "DIY",
    image: "https://via.placeholder.com/150?text=DIY",
    description: "Do-it-yourself projects and ideas",
  },
  {
    id: 19,
    name: "Books",
    image: "https://via.placeholder.com/150?text=Books",
    description: "Book recommendations and reviews",
  },
  {
    id: 20,
    name: "Religion",
    image: "https://via.placeholder.com/150?text=Religion",
    description: "Religious beliefs and practices",
  },
  {
    id: 21,
    name: "Social Media",
    image: "https://via.placeholder.com/150?text=Social+Media",
    description: "Trends and tips on social media",
  },
  {
    id: 22,
    name: "Pets",
    image: "https://via.placeholder.com/150?text=Pets",
    description: "Information about pets and care",
  },
  {
    id: 23,
    name: "Cars",
    image: "https://via.placeholder.com/150?text=Cars",
    description: "Automotive news and reviews",
  },
  {
    id: 24,
    name: "Photography",
    image: "https://via.placeholder.com/150?text=Photography",
    description: "Photography tips and techniques",
  },
  {
    id: 25,
    name: "Gardening",
    image: "https://via.placeholder.com/150?text=Gardening",
    description: "Gardening tips and plant care",
  },
  {
    id: 26,
    name: "Language Learning",
    image: "https://via.placeholder.com/150?text=Language+Learning",
    description: "Resources for learning new languages",
  },
];

const CategorySelection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id) || selectedCategories.length < 6) {
      setSelectedCategories((prev) =>
        prev.includes(id)
          ? prev.filter((categoryId) => categoryId !== id)
          : [...prev, id]
      );
    } else {
      toast.error("You can only select up to 6 categories.");
    }
  };

  return (
    <section className="py-12 bg-gray-200">
      <Toaster />
      <div className="container mx-auto text-center px-4">
        <h1 className="text-3xl font-bold mb-8 text-pink-600">
          Select Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`relative group cursor-pointer ${
                selectedCategories.includes(category.id)
                  ? "border-4 border-pink-600"
                  : "border border-gray-300"
              } rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 bg-white`}
              onClick={() => toggleCategory(category.id)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                <p className="text-white text-sm text-center">
                  {category.description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-pink-600 text-white text-center py-2">
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySelection;
