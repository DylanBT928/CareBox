import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import History from "./pages/History";
import Settings from "./pages/Settings";

function AppRoutes() {
  const { pathname } = useLocation();
  const showNavbar = pathname !== "/"; // Only show navbar if not on welcome

  return (
    <>
      <div style={{ paddingBottom: showNavbar ? "60px" : "0" }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/history" element={<History />} />
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
