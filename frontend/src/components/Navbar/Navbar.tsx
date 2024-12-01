import React, { useState } from "react";

interface NavbarProps {
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
}

const Navbar: React.FC<NavbarProps> = ({
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
      <button className="navbar-link" onClick={onProfileClick}>
        Profile
      </button>
      {isSignedIn ? (
        <button className="navbar-link" onClick={onSignOutClick}>
          Sign Out
        </button>
      ) : (
        <button className="navbar-link" onClick={onSignInClick}>
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Navbar;
