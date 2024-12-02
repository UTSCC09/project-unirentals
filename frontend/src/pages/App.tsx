import React, { useState, useRef, useEffect } from "react";
import UniversityDetailsForm from "../components/UniversityRentalsForm/UniversityRentalsForm";
import PropertyDetailsForm from "../components/PropertyDetailsForm/PropertyDetailsForm";
import RoommateProfilesList from "../components/RoommateProfilesList/RoommateProfilesList";
import ProfileForm from "../components/ProfileForm/ProfileForm";
import {
  signOut,
  fetchCSRFToken,
  Listing,
  addListing,
  getListings,
} from "../api/api";

import Map from "../components/Map/Map";
import Navbar from "../components/Navbar/Navbar";
import SignInForm from "../components/AuthenticationForms/SignInForm";
import SignUpForm from "../components/AuthenticationForms/SignUpForm";
import SearchForm from "../components/SearchForm/SearchForm";
import AddListingButton from "../components/AddListing/AddListing";
import AddListingForm from "../components/AddListingForm/AddListingForm";
import Alert from "../components/AlertComponent/AlertComponent";
import RoutesForm from "../components/RoutesForm/RoutesForm";

const App: React.FC = () => {
  // Fetch CSRF token on app startup
  useEffect(() => {
    let csrfToken = fetchCSRFToken();
    console.log("CSRF token fetched", csrfToken);
  }, []);

  const [loading, setLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  //alerts
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  // Map
  const [center, setCenter] = useState<[number, number]>([43.7845, -79.1864]); // default coords
  const [zoom, setZoom] = useState(10); // zoom level

  // University and Rentals Form
  const [showUniversityDetails, setShowUniversityDetails] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedUniversityShort, setSelectedUniversityShort] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const [listings, setListings] = useState<Listing[]>([]);

  // Property Details Form
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(
    null
  ); // Use Listing or null

  const [showRoutesForm, setShowRoutesForm] = useState(false);

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
  const handleSignInClick = async () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignInSuccess = (email: string) => {
    setUserEmail(email);
    setIsSignedIn(true);
    setAlertMessage('User signed in successfully!');
      setAlertType('success'); 
      setAlertVisible(true);
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
    setShowRoutesForm(false); 
  };

  // Search form
  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  // University and Rentails Form
  const handleUniversityClick = async (
    university: string,
    universityShort: string,
    address: string,
    coordinates: [number, number]
  ) => {
    setSelectedUniversity(university);
    setSelectedUniversityShort(universityShort);
    setSelectedAddress(address);
    setShowUniversityDetails(true);
    setCenter(coordinates);
    setZoom(17);
    setLoading(true);

    // get all the listings to be displayed as markers on the map
    try {
      const listingsData = await getListings();
      console.log("Listings fetched", listingsData);
      setListings(listingsData);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
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
    setCenter([property.longitude, property.latitude]);
    setZoom(17);
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
    if (!isSignedIn) {
      setAlertMessage("Users must sign in to view your profile!");
      setAlertType("warning");
      setAlertVisible(true);
    } else {
      setShowProfileForm(true);
    }
  };

  const handleAddListingCancel = () => {
    setShowAddListing(false);
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

  const handleAddListingClick = () => {
    if (!isSignedIn) {
      setAlertMessage("Users must sign in to add a listing!");
      setAlertType("warning");
      setAlertVisible(true);
    } else {
      setShowAddListing(true);
    }
  };

  const handleAddListingFormSubmit = () => {
    setShowAddListing(false);
    setAlertMessage("New Listing Added Successfully!");
    setAlertType("success");
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleProfileSubmitSuccess = () => {
    setAlertMessage("Profile Updated Successfully!");
    setAlertType("success");
    setAlertVisible(true);
  };

  const handleProfileSubmitError = () => {
    setAlertMessage("Error updating profile");
    setAlertType("error");
    setAlertVisible(true);
  };

  const handleCarClick = () => {
    console.log("Car route selected");
  };

  const handlePublicTransitClick = () => {
    console.log("Public transit route selected");
  };

  const handleWalkClick = () => {
    console.log("Walk route selected");
  };

  const handleRouteToSchoolClick = () => {
    console.log("Route to school clicked");
    setShowRoutesForm(true); 
  };

  const handleCloseRoutesForm = () => {
    setShowRoutesForm(false); 
  }

  // actual components being rendered
  return (
    <div>
      <Navbar
        className="navbar"
        onSignInClick={handleSignInClick}
        onSignOutClick={handleSignOut}
        onUniversityClick={handleUniversityClick}
        onHomeClick={onHomeClick}
        onProfileClick={handleProfileClick}
        isSignedIn={isSignedIn}
      />
      <div
        style={{
          height: "calc(100vh - 50px)",
          width: "100vw",
          position: "absolute",
          top: "50px",
        }}
      >
        <Map center={center} zoom={zoom} listings={listings} />
      </div>
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
          universityShort={selectedUniversityShort}
          address={selectedAddress}
          onClose={handleCloseUniversityDetails}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRentalClick={handleRentalClick}
          listings={listings}
        />
      )}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsForm
          property={selectedProperty}
          onClose={handleClosePropertyDetails}
          onBack={handleBackToUniversityDetails}
          onFindRoommates={handleFindRoommates}
          onRouteToSchoolClick={handleRouteToSchoolClick}
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
          onSubmit={handleProfileSubmitSuccess}
          onError={handleProfileSubmitError}
          email={userEmail}
          isSignedIn={isSignedIn}
        />
      )}
      {showRoutesForm && (
        console.log("showing routes form"),
        <RoutesForm
          onBack={handleCloseRoutesForm}
          onCarClick={handleCarClick}
          onPublicTransitClick={handlePublicTransitClick}
          onWalkClick={handleWalkClick}
        />
      )}
      {!showSearch && (
        <button id="search-toggle-button" onClick={handleSearchClick}>
          Search
        </button>
      )}
      <AddListingButton onClick={handleAddListingClick} />
      {showAddListing && (
        <div style={{ marginTop: "20px" }}>
          <AddListingForm
            onSubmit={handleAddListingFormSubmit}
            onCancel={handleAddListingCancel}
          />
        </div>
      )}
      {alertVisible && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={handleAlertClose}
        />
      )}
    </div>
  );
};

export default App;
