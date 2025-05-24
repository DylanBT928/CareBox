import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import Map from "./pages/Map";
import Settings from "./pages/Settings";

function AppRoutes() {
  const { pathname } = useLocation();
  const showNavbar = !["/", "/signup", "/login"].includes(pathname);

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
          <Route path="/settings" element={<Settings />} />
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
