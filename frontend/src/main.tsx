import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React, { useState, useRef, useEffect } from "react";
import UniversityDetailsForm from "./UniversityRentalsForm";
import PropertyDetailsForm from "./PropertyDetailsForm";
import RoommateProfilesList from "./RoommateProfilesList";
import ProfileForm from "./ProfileForm";
import { signUp, signIn, signOut, fetchCSRFToken } from "./api";
import Map from "./Map";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/login";

/* Navbar component */
const Navbar: React.FC<{
  onSignInClick: () => void;
  onSignOutClick: () => void;
  onUniversityClick: (
    university: string,
    address: string,
    coordinates: [number, number]
  ) => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
  isSignedIn: boolean;
}> = ({
  onSignInClick,
  onUniversityClick,
  onHomeClick,
  onProfileClick,
  onSignOutClick,
  isSignedIn,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // const handleUniversityClick = (address: string) => {
  //   console.log("University Address:", address);
  // };

  return (
    <nav id="navbar">
      <button className="navbar-link" onClick={onHomeClick}>
        Home
      </button>
      <div className="dropdown">
        <button className="navbar-link" onClick={handleDropdownToggle}>
          Universities
        </button>
        {showDropdown && (
          <div className="dropdown-content">
            <button
              className="dropdown-item"
              id="UTSC"
              onClick={() =>
                onUniversityClick(
                  "University of Toronto Scarborough Campus",
                  "1265 Military Trail, Scarborough, ON M1C 1A4",
                  [43.7845, -79.1864]
                )
              }
            >
              UTSC
            </button>
            <button
              className="dropdown-item"
              id="UTSG"
              onClick={() =>
                onUniversityClick(
                  "University of Toronto St. George Campus",
                  "21 Sussex Ave, Toronto, ON M5S 1J6",
                  [43.6629, -79.3957]
                )
              }
            >
              UTSG
            </button>
            <button
              className="dropdown-item"
              id="UTM"
              onClick={() =>
                onUniversityClick(
                  "University of Toronto Mississaauga Campus",
                  "3359 Mississauga Rd, Mississauga, ON L5L 1C6",
                  [43.5489, -79.6626]
                )
              }
            >
              UTM
            </button>
          </div>
        )}
      </div>
      <button
        className="navbar-link"
        id="profile-button"
        onClick={onProfileClick}
      >
        Profile
      </button>
      {isSignedIn ? (
        <button
          id="sign-out-button"
          className="navbar-link"
          onClick={onSignOutClick}
        >
          Sign Out
        </button>
      ) : (
        <button
          id="sign-in-button"
          className="navbar-link"
          onClick={onSignInClick}
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

/* Sign in form component */
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
        <form id="sign-up-form" onSubmit={handleSignUp}>
          <div id="signup-error-message">{errorMessage}</div>
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
        <Login/>
      </div>
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
  // Fetch CSRF token on app startup
  useEffect(() => {
    let csrfToken = fetchCSRFToken();
    console.log("CSRF token fetched", csrfToken);
  }, []);

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Map
  const [center, setCenter] = useState<[number, number]>([43.7845, -79.1864]); // default coords
  const [zoom, setZoom] = useState(2); // zoom level

  // University and Rentals Form
  const [showUniversityDetails, setShowUniversityDetails] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [rentals, setRentals] = useState<string[]>([
    "123 Main St, Scarborough Ontario",
    "330 University Ave, Toronto Ontario",
    "1234 Military Trail, Scarborough Ontario",
  ]);

  // Property Details Form
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({
    owner: "",
    address: "",
    distance: "",
    price: "",
    buildingType: "",
    description: "",
  });

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showRoommateProfiles, setShowRoommateProfiles] = useState(false);
  const [roommateProfiles, setRoommateProfiles] = useState([
    {
      profilePicture: "https://via.placeholder.com/150",
      name: "Alice Johnson",
      age: 25,
      pronouns: "She/Her",
      location: "Toronto, ON",
    },
    {
      profilePicture: "https://via.placeholder.com/150",
      name: "Bob Joe",
      age: 28,
      pronouns: "He/Him",
      location: "Mississauga, ON",
    },
  ]);

  /* Event Handlers */
  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignInSuccess = (email: string) => {
    setUserEmail(email);
    setIsSignedIn(true);
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

  // back to home page
  const onHomeClick = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    setShowSearch(false);
    setShowUniversityDetails(false);
    setShowPropertyDetails(false);
    setShowRoommateProfiles(false);
    setShowProfileForm(false);
  };

  // Search form
  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  // University and Rentails Form
  const handleUniversityClick = (
    university: string,
    address: string,
    coordinates: [number, number]
  ) => {
    setSelectedUniversity(university);
    setSelectedAddress(address);
    setShowUniversityDetails(true);
    setCenter(coordinates);
    setZoom(8);
  };

  const handleCloseUniversityDetails = () => {
    setShowUniversityDetails(false);
  };

  const handlePrevious = () => {};

  const handleNext = () => {};

  // Property Details Form

  const handleRentalClick = (property: {
    owner: string;
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

  const handleFindRoommates = () => {
    setShowRoommateProfiles(true);
  };

  const handleCloseRoommateProfiles = () => {
    setShowRoommateProfiles(false);
  };

  const handleBackToPropertyDetails = () => {
    setShowRoommateProfiles(false);
    setShowPropertyDetails(true);
  };

  const handleProfileClick = () => {
    setShowProfileForm(true);
  };

  const handleSignOut = async () => {
    try {
      const response = await signOut();
      if (response.success) {
        console.log("User signed out successfully");
        setIsSignedIn(false);
        setUserEmail("");
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("An error occurred during sign out", error);
    }
  };

  // actual components being rendered
  return (
    <div>
      <Navbar
        onSignInClick={handleSignInClick}
        onSignOutClick={handleSignOut}
        onUniversityClick={handleUniversityClick}
        onHomeClick={onHomeClick}
        onProfileClick={handleProfileClick}
        isSignedIn={isSignedIn}
      />
      <Map center={center} zoom={zoom} />
      {showSignIn && (
        <SignInForm
          onClose={handleCloseForm}
          onSignUpClick={handleSignUpClick}
          onSignInSuccess={handleSignInSuccess}
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
          onRentalClick={handleRentalClick}
        />
      )}
      {showPropertyDetails && (
        <PropertyDetailsForm
          property={selectedProperty}
          onClose={handleClosePropertyDetails}
          onBack={handleBackToUniversityDetails}
          onFindRoommates={handleFindRoommates}
        />
      )}
      {showRoommateProfiles && (
        <RoommateProfilesList
          profiles={roommateProfiles}
          onClose={handleCloseRoommateProfiles}
          onBack={handleBackToPropertyDetails}
        />
      )}
      {showProfileForm && (
        <ProfileForm
          onClose={() => setShowProfileForm(false)}
          email={userEmail}
        />
      )}
      {
        // search bar
        /* {!showSearch && (
        <button id="search-toggle-button" onClick={handleSearchClick}>
          Search
        </button>
      )} */
      }
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="202435428933-3lre5ob5rajcfimt8q4r64c9n2a1t7cl.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
