import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import Map from "./pages/Map";
import Settings from "./pages/Settings";

function AppRoutes() {
  const location = useLocation();
  const showNavbar = !["/", "/signup", "/login"].includes(location.pathname);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  return (
    <>
      <div
        className="app-container"
        style={{ paddingBottom: showNavbar ? "70px" : "0" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="page-container"
          >
            <Routes location={location}>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/add" element={<AddItem />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
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
