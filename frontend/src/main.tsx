import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React, { useState } from "react";

/* Navbar component */
const Navbar: React.FC<{ onSignInClick: () => void }> = ({ onSignInClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav id="navbar">
      <button className="navbar-link">Home</button>
      <div className="dropdown">
        <button className="navbar-link" onClick={handleDropdownToggle}>
          Universities
        </button>
        {showDropdown && (
          <div className="dropdown-content">
            <button className="dropdown-item">UTSC</button>
            <button className="dropdown-item">UTSG</button>
            <button className="dropdown-item">UTM</button>
          </div>
        )}
      </div>
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

/* Sign in form component */
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

/* Sign up form component */
const SignUpForm: React.FC<{
  onClose: () => void;
  onSignUpBackClick: () => void;
}> = ({ onClose, onSignUpBackClick }) => {
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
        <input type="text" id="sign-up-username" placeholder="Username" />
        <input type="password" id="sign-up-password" placeholder="Password" />
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm Password"
        />
        <button id="sign-up-button">Sign Up</button>
        <button id="sign-up-button">Sign Up with Google</button>
      </div>
    </div>
  );
};

// Map
const Map: React.FC = () => {
  return (
    <div id="map-container">
      <iframe
        width="100%"
        height="1190"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-79.21473026275636%2C43.77053600288821%2C-79.15808200836183%2C43.79730524799403&amp;layer=mapnik&amp;marker=43.783922123809695%2C-79.18640613555908"
      ></iframe>
      <br />
    </div>
  );
};

// Search form
const SearchForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div id="search-container" className="slide-up">
      <div id="search-form">
        <span id="close-search-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="search-form-title">Search</h2>
        <input
          type="text"
          id="search-query"
          placeholder="Search for an address"
        />
        <button id="search-button">Search</button>
      </div>
    </div>
  );
};

// Actual app component
const App: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  /* Event Handlers */
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

  // Search form
  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  // actual components being rendered
  return (
    <div>
      <Navbar onSignInClick={handleSignInClick} />
      <Map />
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
      {showSearch && <SearchForm onClose={handleCloseSearch} />}
      {!showSearch && (
        <button id="search-toggle-button" onClick={handleSearchClick}>
          Search
        </button>
      )}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
