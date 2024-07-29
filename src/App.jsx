import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { NavbarSimple } from "./components/Navbar";
import StartGame from "./components/StartGame";

function App() {
  return (
    <div>
      <NavbarSimple />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start-game" element={< StartGame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
