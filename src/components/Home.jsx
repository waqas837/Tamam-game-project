import React from "react";
import HeroSection from "./HeroSection";
import Cards from "./Cards";
import PackagesCards from "./PackagesCards";
import GamesShowDown from "./GamesShowDown";
import AboutUs from "./AboutUs";
const Home = () => {
  return (
    <div>
      <HeroSection />
      <Cards />
      <GamesShowDown />
      <PackagesCards />
      <AboutUs />
    </div>
  );
};

export default Home;
