import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "./SignUp.css";

type Credentials = {
  email: string;
  password: string;
};

const [credentialsValue, setcredentialsValue] = useState<Credentials>({
    email: '',
    password: '',
});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setcredentialsValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', credentialsValue);
    alert(`Name: ${credentialsValue.email}, Email: ${credentialsValue.email}`);
    const auth = getAuth();
createUserWithEmailAndPassword(auth, credentialsValue.email, credentialsValue.password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
};

export default function SignUp() {
  
  return (
  <div>
    <div>CareBox</div>
    <div>
      <form onSubmit={handleSubmit}>
      <label htmlFor="email">Enter email:</label>
      <input
        type="email"
        id="email"
        value={credentialsValue.email}
        onChange={handleChange}
      />
      <label htmlFor="password">Enter password:</label>
      <input
        type="password"
        id="password"
        value={credentialsValue.password}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
    </div>
  </div>
    );
}
