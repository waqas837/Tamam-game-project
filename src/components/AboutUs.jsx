import React from "react";

const teamMembers = [
  {
    name: "جين دو",
    role: "الرئيس التنفيذي",
    image: "test.jpg",
    bio: "جين هي الرؤية وراء شركتنا، تقود بشغف وخبرة.",
  },
  {
    name: "جون سميث",
    role: "المدير الفني",
    image: "test.jpg",
    bio: "جون يضمن أن تكنولوجيا لدينا تظل متطورة وموثوقة.",
  },
  {
    name: "إميلي جونسون",
    role: "مدير التسويق",
    image: "test.jpg",
    bio: "إميلي تقود جهودنا التسويقية، وتربطنا بجمهورنا بفعالية.",
  },
];

const TeamMemberCard = ({ name, role, image, bio }) => (
  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white border border-pink-300 rounded-lg shadow-lg overflow-hidden mb-6 mx-2 sm:mx-4">
    <img src={image} alt={name} className="w-full h-40 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-bold text-pink-600 mb-1">{name}</h3>
      <p className="text-lg text-gray-700 mb-4">{role}</p>
      <p className="text-gray-600">{bio}</p>
    </div>
  </div>
);

const AboutUs = () => (
  <section className="py-12 bg-gray-100">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">معلومات عنا</h1>
      <p className="text-lg text-gray-700 mb-12">
        نحن فريق شغوف مكرس لتقديم أفضل تجارب الألعاب لمستخدمينا. مهمتنا هي إنشاء
        ألعاب مثيرة ولا تُنسى تتناغم مع اللاعبين حول العالم.
      </p>
      <div className="flex flex-wrap justify-center">
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={index}
            name={member.name}
            role={member.role}
            image={member.image}
            bio={member.bio}
          />
        ))}
      </div>
    </div>
  </section>
);

export default AboutUs;
