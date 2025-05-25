import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

type Credentials = {
  email: string;
  password: string;
};

export default function SignUp() {
  const [credentialsValue, setcredentialsValue] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setcredentialsValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!termsAccepted) {
      setErrorMessage("Please accept the terms and conditions");
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(
      auth,
      credentialsValue.email,
      credentialsValue.password
    )
      .then((_userCredential) => {
        navigate("/home");
      })
      .catch((error) => {
        setErrorMessage(`Error signing up: ${error.message}`);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-title">Sign Up for CareBox</div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            value={credentialsValue.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            value={credentialsValue.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
          <label htmlFor="terms">
            I agree to the{" "}
            <span className="terms-link">Terms & Conditions</span>
          </label>
        </div>

        <button type="submit">Create Account</button>

        <button onClick={() => navigate("/")}>Back</button>
      </form>
          
      <div className="signup-login-prompt">
        Already have an account?{" "}
        <span className="signup-login-link" onClick={() => navigate("/login")}>
          Log In
        </span>
      </div>
     
    </div>
  );
}
