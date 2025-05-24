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
    alert(`Name: ${credentialsValue.email}, Email: ${credentialsValue.email}`);

    const auth = getAuth();

    createUserWithEmailAndPassword(
      auth,
      credentialsValue.email,
      credentialsValue.password
    )
      .then((_userCredential) => {
        alert("Account created successfully!");
        navigate("/home");
      })
      .catch((error) => {
        alert("Error signing up: " + error.message);
      });
  };

  return (
    <div className="signup-container">
      <h1>Sign Up for CareBox</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          id="email"
          value={credentialsValue.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          id="password"
          value={credentialsValue.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
