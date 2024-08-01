import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NavbarSimple from "./components/Navbar";
import StartGame from "./components/StartGame";
import GameStarted from "./components/GameStarted";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Router>
        <NavbarSimple />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start-game" element={<StartGame />} />
          <Route path="/started-game" element={<GameStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
