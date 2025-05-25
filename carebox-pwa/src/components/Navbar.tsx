import { Link, useLocation } from "react-router-dom";
import BunnyHead from "../assets/bunny_head.png";
import HomeIcon from "../assets/home_icon.png";
import BookIcon from "../assets/book_icon.png";
import SettingsIcon from "../assets/settings_icon.png";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/home", icon: BunnyHead, ariaLabel: "Home" },
    { path: "/map", icon: HomeIcon, ariaLabel: "Map" },
    { path: "/add", icon: BookIcon, ariaLabel: "Add Item" },
    { path: "/settings", icon: SettingsIcon, ariaLabel: "Settings" },
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
          <img src={item.icon} alt="" className="nav-icon" />
        </Link>
      ))}
    </nav>
  );
}
