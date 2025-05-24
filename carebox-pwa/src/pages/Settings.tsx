import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // alert("Signed out successfully!");
        navigate("/");
      })
      .catch((error) => {
        alert("Error signing out: " + error.message);
      });
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}
