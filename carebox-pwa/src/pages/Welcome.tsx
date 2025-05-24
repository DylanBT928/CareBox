import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-title">CareBox</div>
      <img src={logo} alt="CareBox Logo" className="welcome-logo" />
      <div className="welcome-buttons">
        <button onClick={() => navigate("/login")}>Log In</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}
