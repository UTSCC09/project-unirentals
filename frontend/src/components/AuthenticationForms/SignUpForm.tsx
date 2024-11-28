import React, { useState } from "react";
import { signUp } from "../../api/api";
import Login from "./login";
import "./AuthForms.css";



const SignUpForm: React.FC<{
    onClose: () => void;
    onSignUpBackClick: () => void;
  }> = ({ onClose, onSignUpBackClick }) => {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleSignUp = async () => {
      console.log("signUp: ", email, password, confirmPassword);
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
      // call sign up
      // Create FormData object
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password1", password);
      formData.append("password2", confirmPassword);
      try {
        console.log("signUp: ", formData);
        const response = await signUp(formData);
        if (response.success) {
          console.log("User signed up successfully", email);
          onClose();
        } else {
          setErrorMessage(response.message);
        }
      } catch (error) {
        setErrorMessage("An error occurred during sign up");
      }
    };
  
    return (
      <div id="sign-in-container">
        <div id="sign-in-form">
          <span id="close-button" onClick={onClose}>
            &times;
          </span>
          <span id="back-button" onClick={onSignUpBackClick}>
            &#8249;
          </span>
          <h2 id="sign-in-form-title">Sign Up</h2>
          <form id="sign-in-form" onSubmit={handleSignUp}>
            <div id="signin-error-message">{errorMessage}</div>
            <input
              type="text"
              id="sign-up-email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              //required
            />
            <input
              type="password"
              id="sign-up-password"
              name="password1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              id="confirm-password"
              name="password2"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" id="sign-up-button" onClick={handleSignUp}>
              Sign Up
            </button>
            
          </form>
          <div id="or-text">OR</div>
          <Login/>
        </div>
      </div>
    );
  };

  export default SignUpForm;