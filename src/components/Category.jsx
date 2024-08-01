import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { X, Check } from "lucide-react";
import { useSpring, animated } from "react-spring";

const categories = [
  {
    id: 1,
    name: "رياضة",
    image: "https://via.placeholder.com/150?text=Sports",
    description: "كل ما يتعلق بالرياضات المختلفة",
  },
  {
    id: 2,
    name: "تكنولوجيا",
    image: "https://via.placeholder.com/150?text=Technology",
    description: "أحدث الأخبار في التقنية والأجهزة",
  },
  {
    id: 3,
    name: "موسيقى",
    image: "https://via.placeholder.com/150?text=Music",
    description: "استكشف أنواع الموسيقى والفنانين المختلفين",
  },
  {
    id: 4,
    name: "أفلام",
    image: "https://via.placeholder.com/150?text=Movies",
    description: "كل شيء متعلق بالأفلام والسينما",
  },
  {
    id: 5,
    name: "طعام",
    image: "https://via.placeholder.com/150?text=Food",
    description: "وصفات لذيذة ونصائح طبخ",
  },
  {
    id: 6,
    name: "سفر",
    image: "https://via.placeholder.com/150?text=Travel",
    description: "وجهات وتجارب السفر",
  },
  {
    id: 7,
    name: "صحة",
    image: "https://via.placeholder.com/150?text=Health",
    description: "نصائح لأسلوب حياة صحي",
  },
  {
    id: 8,
    name: "تعليم",
    image: "https://via.placeholder.com/150?text=Education",
    description: "موارد تعليمية ونصائح",
  },
  {
    id: 9,
    name: "أعمال",
    image: "https://via.placeholder.com/150?text=Business",
    description: "أفكار واستراتيجيات للأعمال",
  },
  {
    id: 10,
    name: "علم",
    image: "https://via.placeholder.com/150?text=Science",
    description: "اكتشافات وأبحاث في العلم",
  },
  {
    id: 11,
    name: "فن",
    image: "https://via.placeholder.com/150?text=Art",
    description: "الفنون والتعبيرات الإبداعية",
  },
  {
    id: 12,
    name: "موضة",
    image: "https://via.placeholder.com/150?text=Fashion",
    description: "اتجاهات وأسلوب الموضة",
  },
  {
    id: 13,
    name: "تاريخ",
    image: "https://via.placeholder.com/150?text=History",
    description: "أحداث تاريخية وشخصيات",
  },
  {
    id: 14,
    name: "ألعاب",
    image: "https://via.placeholder.com/150?text=Gaming",
    description: "ألعاب الفيديو وثقافة الألعاب",
  },
  {
    id: 15,
    name: "سياسة",
    image: "https://via.placeholder.com/150?text=Politics",
    description: "أخبار وتحليلات سياسية",
  },
  {
    id: 16,
    name: "مالية",
    image: "https://via.placeholder.com/150?text=Finance",
    description: "نصائح مالية وأفكار السوق",
  },
  {
    id: 17,
    name: "بيئة",
    image: "https://via.placeholder.com/150?text=Environment",
    description: "القضايا البيئية والحلول",
  },
  {
    id: 18,
    name: "افعلها بنفسك",
    image: "https://via.placeholder.com/150?text=DIY",
    description: "مشاريع وأفكار افعلها بنفسك",
  },
  {
    id: 19,
    name: "كتب",
    image: "https://via.placeholder.com/150?text=Books",
    description: "توصيات ومراجعات الكتب",
  },
  {
    id: 20,
    name: "دين",
    image: "https://via.placeholder.com/150?text=Religion",
    description: "المعتقدات والممارسات الدينية",
  },
  {
    id: 21,
    name: "وسائل التواصل الاجتماعي",
    image: "https://via.placeholder.com/150?text=Social+Media",
    description: "اتجاهات ونصائح على وسائل التواصل الاجتماعي",
  },
  {
    id: 22,
    name: "حيوانات أليفة",
    image: "https://via.placeholder.com/150?text=Pets",
    description: "معلومات عن الحيوانات الأليفة والعناية بها",
  },
  {
    id: 23,
    name: "سيارات",
    image: "https://via.placeholder.com/150?text=Cars",
    description: "أخبار ومراجعات السيارات",
  },
  {
    id: 24,
    name: "تصوير",
    image: "https://via.placeholder.com/150?text=Photography",
    description: "نصائح وتقنيات التصوير",
  },
  {
    id: 25,
    name: "بستنة",
    image: "https://via.placeholder.com/150?text=Gardening",
    description: "نصائح بستنة والعناية بالنباتات",
  },
  {
    id: 26,
    name: "تعلم اللغات",
    image: "https://via.placeholder.com/150?text=Language+Learning",
    description: "موارد لتعلم لغات جديدة",
  },
];
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
        src={category.image}
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
      toast.error("يمكنك اختيار ما يصل إلى 6 فئات فقط.");
    }
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
              key={category.id}
              category={category}
              isSelected={selectedCategories.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
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