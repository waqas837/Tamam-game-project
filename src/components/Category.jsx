import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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

  return (
    <section className="py-12 bg-gray-200">
      <Toaster />
      <div className="container mx-auto text-center px-4">
        <h1 className="text-3xl font-bold mb-8 text-pink-600">
          اختر الفئات
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
