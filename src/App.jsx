import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NavbarSimple from "./components/Navbar";
import StartGame from "./components/StartGame";
import GameStarted from "./components/GameStarted";
import Footer from "./components/Footer";
// Admin components
import AdminLayout from "./components/Admin/Layout";
import AddQuestion from "./components/Admin/AddQuestion";
import AdminLogin from "./components/Admin/Signin";
import QuestionsList from "./components/Admin/QuestionsList";
import MyGames from "./components/MyGames";
import Result from "./components/Result";
import NotFound from "./components/NotFound"; // Import the NotFound component

const App = () => {
  const location = useLocation();
  // Determine if the current route is the admin route
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div>
      {!isAdminRoute && <NavbarSimple />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-game" element={<StartGame />} />
        <Route path="/my-games" element={<MyGames />} />
        <Route path="/started-game" element={<GameStarted />} />
        <Route path="/results" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="add-question" element={<AddQuestion />} />
          <Route path="question-list" element={<QuestionsList />} />
        </Route>
        <Route path="*" element={<NotFound />} /> {/* Wildcard route for 404 */}
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
