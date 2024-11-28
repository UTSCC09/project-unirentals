import React, { useState, useRef, useEffect } from "react";
import UniversityDetailsForm from "../components/UniversityRentalsForm/UniversityRentalsForm";
import PropertyDetailsForm from "../components/PropertyDetailsForm/PropertyDetailsForm";
import RoommateProfilesList from "../components/RoommateProfilesList/RoommateProfilesList";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import { signOut, fetchCSRFToken, Listing } from "../api/api";
import Map from "../components/Map";
import Navbar from "../components/Navbar";
import SignInForm from "../components/AuthenticationForms/SignInForm";
import SignUpForm from "../components/AuthenticationForms/SignUpForm";
import SearchForm from "../components/SearchForm/SearchForm";


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
  // const [rentals, setRentals] = useState<string[]>([
  //   "123 Main St, Scarborough Ontario",
  //   "330 University Ave, Toronto Ontario",
  //   "1234 Military Trail, Scarborough Ontario",
  // ]);

  // Property Details Form
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null); // Use Listing or null

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

  const handleRentalClick = (property: Listing) => {
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
          onSignInSuccess={handleSignInSuccess}
        />
      )}
      {showSearch && <SearchForm onClose={handleCloseSearch} />}
      {showUniversityDetails && (
        <UniversityDetailsForm
          university={selectedUniversity}
          address={selectedAddress}
          onClose={handleCloseUniversityDetails}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRentalClick={handleRentalClick}
        />
      )}
      {showPropertyDetails && selectedProperty && (
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


export default App
