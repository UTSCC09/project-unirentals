import React, { useState } from "react";
import { signIn } from "../../api/api";
import Login from "./login";
import "./AuthForms.css"



const SignInForm: React.FC<{
  onClose: () => void;
  onSignUpClick: () => void;
  onSignInSuccess: (email: string) => void;
}> = ({ onClose, onSignUpClick, onSignInSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      console.log("signIn: ", formData);
      const response = await signIn(formData);
      if (response.success) {
        console.log("User signed in successfully:", email);
        onSignInSuccess(email);
        onClose();
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred during sign in");
    }
  };

  return (
    <div id="sign-in-container">
      <div id="sign-in-form">
        <span id="close-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="sign-in-form-title">Sign In</h2>
        <form id="sign-in-form" onSubmit={handleSignIn}>
          <input
            type="text"
            id="sign-in-email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="sign-in-password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" id="login-button" onClick={handleSignIn}>
            Sign In
          </button>
        </form>
        <div id="or-text">OR</div>
        <Login onClose={onClose} onSignUpClick={onSignUpClick} onSignInSuccess={onSignInSuccess}/>
        <div id="sign-in-text">
          No account?{" "}
          <a href="#" onClick={onSignUpClick}>
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;