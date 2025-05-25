import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

type Credentials = {
  fname: string;
  lname: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const [credentialsValue, setcredentialsValue] = useState<Credentials>({
    fname: "",
    lname: "",
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
      .then(async (_userCredential) => {
        const user = _userCredential.user;

        updateProfile(user, {displayName: credentialsValue.fname})

        await addDoc(collection(db, "names"), {
          fname: credentialsValue.fname,
          lname: credentialsValue.lname,
          userId: user.uid
        });
        
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
          <label htmlFor="fname">First name</label>
          <input
            name="fname"
            type="fname"
            id="fname"
            value={credentialsValue.fname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lname">Last name</label>
          <input
            name="lname"
            type="lname"
            id="lname"
            value={credentialsValue.lname}
            onChange={handleChange}
            required
          />
        </div>

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
