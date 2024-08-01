import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { BookOpen, List, Activity, Trophy } from "lucide-react";

const FeatureCard = ({ title, description, icon: Icon }) => {
  // Intersection observer hook
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1, // 10% of the component is in view
  });

  // Spring animation
  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 280, friction: 40 },
  });

  return (
    <animated.div
      ref={ref}
      style={springProps}
      className="bg-white rounded-lg shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-pink-100">
        <Icon className="w-6 h-6 text-pink-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </animated.div>
  );
};

const GameFeaturesSection = () => {
  const features = [
    {
      title: "فئات متعددة",
      description: "اختر من مجموعة واسعة من المجالات لاختبار معرفتك.",
      icon: BookOpen,
    },
    {
      title: "مجموعات أسئلة ديناميكية",
      description: "اختبر تحديات جديدة بقاعدة بيانات الأسئلة المحدثة باستمرار.",
      icon: List,
    },
    {
      title: "تتبع التقدم",
      description: "راقب تقدمك بمرور الوقت من خلال تحليلات أداء مفصلة.",
      icon: Activity,
    },
    {
      title: "لوحة المتصدرين",
      description: "تنافس مع الآخرين وشاهد كيف تصدرت بين عشاق الألغاز الآخرين.",
      icon: Trophy,
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-pink-500 text-center mb-12">
          ميزات اللعبة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameFeaturesSection;
