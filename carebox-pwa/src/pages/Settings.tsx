import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Settings(props: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert("Error signing out: " + error.message);
      });
  };

  const toggleDarkMode = () => {
    props.setDarkMode(!props.darkMode);
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="settings-option">
        <span className="setting-label"></span>
        <button onClick={toggleDarkMode} className="theme-toggle-btn">
          {props.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}
