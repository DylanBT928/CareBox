import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { FaMap } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/home", icon: <HiHome size={28} />, ariaLabel: "Home" },
    { path: "/add", icon: <IoMdAdd size={28} />, ariaLabel: "Add Item" },
    { path: "/map", icon: <FaMap size={26} />, ariaLabel: "Map" },
    {
      path: "/settings",
      icon: <IoSettings size={26} />,
      ariaLabel: "Settings",
    },
  ];

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${pathname === item.path ? "active" : ""}`}
          aria-label={item.ariaLabel}
        >
          <div className="nav-icon">{item.icon}</div>
          {pathname === item.path && (
            <motion.div
              className="nav-indicator"
              layoutId="nav-indicator"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </Link>
      ))}
    </nav>
  );
}
