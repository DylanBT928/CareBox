import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import {GoogleLogin} from '@react-oauth/google';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

type Credentials = {
  email: string;
  password: string;
};

export default function Login() {
  const [credentialsValue, setcredentialsValue] = useState<Credentials>({
    email: "",
    password: "",
  });
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

    const auth = getAuth();
    signInWithEmailAndPassword(
      auth,
      credentialsValue.email,
      credentialsValue.password
    )
      .then((_userCredential) => {
        navigate("/home");
      })
      .catch((error) => {
        setErrorMessage(`Error signing in: ${error.message}`);
      });
  };

  return (
    <div className="login-container">
      <div className="login-title">CareBox</div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentialsValue.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentialsValue.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Log In</button>
        <button onClick={() => navigate("/")}>Back</button>
        <div className="forgot-password">Forgot Password?</div>
      </form>

      <div className="login-signup-prompt">
        Don't have an account?{" "}
        <span className="login-signup-link" onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </div>
    </div>
  );
}
