import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import Map from "./pages/Map";
import Settings from "./pages/Settings";
import { useEffect, useState } from "react";

function AppRoutes() {
  const { pathname } = useLocation();
  const showNavbar = !["/", "/signup", "/login"].includes(pathname);
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <div style={{ paddingBottom: showNavbar ? "60px" : "0" }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/map" element={<Map />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode}/>} />
        </Routes>
      </div>
      {showNavbar && <Navbar />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
