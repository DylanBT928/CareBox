import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/home" className={pathname === "/home" ? "active" : ""}>
        Home
      </Link>
      <Link to="/add" className={pathname === "/add" ? "active" : ""}>
        Add
      </Link>
      <Link to="/map" className={pathname === "/map" ? "active" : ""}>
        Map
      </Link>
      <Link to="/settings" className={pathname === "/settings" ? "active" : ""}>
        Settings
      </Link>
    </nav>
  );
}
