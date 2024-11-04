import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React, { useState } from "react";
import UniversityDetailsForm from "./UniversityRentalsForm";
import PropertyDetailsForm from "./PropertyDetailsForm";

/* Navbar component */
const Navbar: React.FC<{ onSignInClick: () => void; onUniversityClick: (university: string, address: string) => void }> = ({ onSignInClick, onUniversityClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // const handleUniversityClick = (address: string) => {
  //   console.log("University Address:", address);
  // };

  return (
    <nav id="navbar">
      <button className="navbar-link">Home</button>
      <div className="dropdown">
        <button className="navbar-link" onClick={handleDropdownToggle}>
          Universities
        </button>
        {showDropdown && (
          <div className="dropdown-content">
            <button
              className="dropdown-item"
              id="UTSC"
              onClick={() => onUniversityClick("University of Toronto Scarborough Campus", "1265 Military Trail, Scarborough, ON M1C 1A4")}
            >
              UTSC
            </button>
            <button
              className="dropdown-item"
              id="UTSG"
              onClick={() => onUniversityClick("University of Toronto St. George Campus", "21 Sussex Ave, Toronto, ON M5S 1J6")}
            >
              UTSG
            </button>
            <button
              className="dropdown-item"
              id="UTM"
              onClick={() => onUniversityClick("University of Toronto Mississaauga Campus", "3359 Mississauga Rd, Mississauga, ON L5L 1C6")}
            >
              UTM
            </button>
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    /*try {
    await SignUp(username, email, password);
    console.log("User signed up successfully", username, email, password);
  } catch (error) {
    console.log("Error signing up user", error);
  }
*/
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
        <div id="signup-error-message">{errorMessage}</div>
        <input
          type="text"
          id="sign-up-username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          //required
        />
        <input
          type="password"
          id="sign-up-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button id="sign-up-button" onClick={handleSignUp}>
          Sign Up
        </button>
        <a id="sign-up-button">Sign up with Google</a>
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
  const [showFilters, setShowFilters] = useState(false);

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };
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
        <a id="filters-toggle-button" onClick={handleFiltersToggle}>
          Filters
        </a>
        {showFilters && (
          <div id="filters">
            <div className="filter-group">
              <input type="text" id="price-filter" placeholder="Price" />
              <span className="filters-label">CAD</span>
              <input type="text" id="distance-filter" placeholder="Distance" />
              <span className="filters-label">km</span>
            </div>
          </div>
        )}
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

  // University and Rentals Form
  const [showUniversityDetails, setShowUniversityDetails] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [rentals, setRentals] = useState<string[]>(["Property 1", "Property 2", "Property 3"]);

  // Property Details Form
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({
    name: "",
    address: "",
    distance: "",
    price: "",
    buildingType: "",
    description: "",
  });


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

  // University and Rentails Form
  const handleUniversityClick = (university: string, address: string) => {
    setSelectedUniversity(university);
    setSelectedAddress(address);
    setShowUniversityDetails(true);
  };

  const handleCloseUniversityDetails = () => {
    setShowUniversityDetails(false);
  };

  const handlePrevious = () => {

  };

  const handleNext = () => {
    
  };

  // Property Details Form

 const handleRentalClick = (property: {
    name: string;
    address: string;
    distance: string;
    price: string;
    buildingType: string;
    description: string;
  }) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleClosePropertyDetails = () => {
    setShowPropertyDetails(false);
  };

  const handleBackToUniversityDetails = () => {
    setShowPropertyDetails(false);
    setShowUniversityDetails(true);
  };

  // actual components being rendered
  return (
    <div>
      <Navbar onSignInClick={handleSignInClick} onUniversityClick={handleUniversityClick} />
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
      {showUniversityDetails && (
        <UniversityDetailsForm
          university={selectedUniversity}
          address={selectedAddress}
          rentals={rentals}
          onClose={handleCloseUniversityDetails}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRentalClick={handleRentalClick} // go to UniversityDetailsForm
        />
      )}
        {showPropertyDetails && (
        <PropertyDetailsForm
          property={selectedProperty}
          onClose={handleClosePropertyDetails}
          onBack={handleBackToUniversityDetails}
        />
      )}
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
