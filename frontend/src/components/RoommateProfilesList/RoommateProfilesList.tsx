import React from "react";
import "./RoommateProfilesList.css";
import { FaMapMarkerAlt } from "react-icons/fa";

interface RoommateProfile {
  profilePicture: string;
  name: string;
  age: number;
  pronouns: string;
  location: string;
}

interface RoommateProfilesListProps {
  profiles: RoommateProfile[];
  onClose: () => void;
  onBack: () => void;
}

const RoommateProfilesList: React.FC<RoommateProfilesListProps> = ({
  profiles,
  onClose,
  onBack,
}) => {
  return (
    <div id="roommate-profiles-container">
      <div id="roommate-profiles-list">
        <span id="close-roommate-profiles-button" onClick={onClose}>
          &times;
        </span>
        <span id="back-button" onClick={onBack}>
          &#8249;
        </span>
        <h2 id="roommate-profiles-title">Roommate Profiles</h2>
        <ul id="profiles-list">
          {profiles.map((profile, index) => (
            <li key={index} className="profile-item">
              <img
                src={profile.profilePicture}
                alt={`${profile.name}'s profile`}
                className="profile-picture"
              />
              <div className="profile-details">
                <h3 className="profile-name">{profile.name}</h3>
                <p className="profile-age-pronouns">
                  {profile.age} | {profile.pronouns}
                </p>
                <p className="profile-location">
                  {" "}
                  <FaMapMarkerAlt />
                  {profile.location}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoommateProfilesList;
