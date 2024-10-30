import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React, { useState } from "react";

const Navbar: React.FC<{ onSignInClick: () => void }> = ({ onSignInClick }) => {
  return (
    <nav id="navbar">
      <button className="navbar-link">Home</button>
      <button className="navbar-link">Map</button>
      <button className="navbar-link">Find Roommates</button>
      <button
        id="sign-in-button"
        className="navbar-link"
        onClick={onSignInClick}
      >
        Sign In
      </button>
    </nav>
  );
};

const SignInForm: React.FC<{
  onClose: () => void;
  onSignUpClick: () => void;
}> = ({ onClose, onSignUpClick }) => {
  return (
    <div id="sign-in-container">
      <div id="sign-in-form">
        <span id="close-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="sign-in-form-title">Sign In</h2>
        <input type="text" id="sign-in-username" placeholder="Username" />
        <input type="password" id="sign-in-password" placeholder="Password" />
        <button id="login-button">Sign In</button>
        <a href="https://accounts.google.com/signin" id="google-login-button">
          Sign in with Google
        </a>
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

const SignUpForm: React.FC<{ onClose: () => void; onSignUpBackClick: () => void }> = ({
  onClose,
  onSignUpBackClick,
}) => {
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
        <input type="text" id="username" placeholder="Username" />
        <input type="email" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm Password"
        />
        <button id="sign-up-button">Sign Up</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleCloseForm = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const handleSignUpBackClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  return (
    <div>
      <Navbar onSignInClick={handleSignInClick} />
      {showSignIn && (
        <SignInForm
          onClose={handleCloseForm}
          onSignUpClick={handleSignUpClick}
        />
      )}
      {showSignUp && (
        <SignUpForm
          onClose={handleCloseForm}
          onSignUpBackClick={handleSignUpBackClick}
        />
      )}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
