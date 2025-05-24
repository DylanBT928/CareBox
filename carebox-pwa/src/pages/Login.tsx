import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {GoogleLogin} from '@react-oauth/google';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./SignUp.css";

type Credentials = {
  email: string;
  password: string;
};

export default function Login() {
  const [credentialsValue, setcredentialsValue] = useState<Credentials>({
    email: "",
    password: "",
  });

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
    console.log("Form submitted:", credentialsValue);
    // alert(`Name: ${credentialsValue.email}, Email: ${credentialsValue.email}`);
    const auth = getAuth();
    signInWithEmailAndPassword(
      auth,
      credentialsValue.email,
      credentialsValue.password
    )
      .then((_userCredential) => {
        // alert("Logged in successfully!");
        navigate("/home");
      })
      .catch((error) => {
        alert("Error signing up: " + error.message);
      });
  };

  return (
    <div>
      <div>CareBox</div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentialsValue.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Enter password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentialsValue.password}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
