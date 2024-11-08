import React, { useState } from "react";
import "./ProfileForm.css";

interface ProfileFormProps {
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose }) => {
  const [profile, setProfile] = useState({
    photo: "",
    name: "",
    age: "",
    pronouns: "",
    jobSchool: "",
    location: "",
    budget: "",
    moveDate: "",
    aboutMe: "",
    preferences: {
      smoker: false,
      petOwner: false,
      drinks: false,
    },
  });

  // event handlers
  // call this whenever the input fields change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Destructuring name and value from the input element
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({ ...profile, photo: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // call this whenever the checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile({ ...profile, preferences: { ...profile.preferences, [name]: checked } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission
    // Logging profile for now
    console.log("Profile submitted:", profile);
    onClose();
  };

  return (
    <div id="profile-form-container">
      <div id="profile-form">
        <span id="close-profile-form-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="profile-form-title">Edit Profile</h2>
        <div id="profile-image-container">
          {profile.photo && <img src={profile.photo} alt="Profile" id="profile-image" />}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input type="file" id="photo" name="photo" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input type="number" id="age" name="age" value={profile.age} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="pronouns">Pronouns</label>
            <input type="text" id="pronouns" name="pronouns" value={profile.pronouns} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="jobSchool">Job/School</label>
            <input type="text" id="jobSchool" name="jobSchool" value={profile.jobSchool} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Looking in (Location)</label>
            <input type="text" id="location" name="location" value={profile.location} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <input type="number" id="budget" name="budget" value={profile.budget} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="moveDate">Ready to Move (Date)</label>
            <input type="date" id="moveDate" name="moveDate" value={profile.moveDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="aboutMe">About Me</label>
            <textarea id="aboutMe" name="aboutMe" value={profile.aboutMe} onChange={handleInputChange}></textarea>
          </div>
          <div className="form-group">
            <label>Preferences</label>
            <div className="preferences">
              <label>
                <input type="checkbox" name="smoker" checked={profile.preferences.smoker} onChange={handleCheckboxChange} />
                Smoker
              </label>
              <label>
                <input type="checkbox" name="petOwner" checked={profile.preferences.petOwner} onChange={handleCheckboxChange} />
                Pet Owner
              </label>
              <label>
                <input type="checkbox" name="drinks" checked={profile.preferences.petOwner} onChange={handleCheckboxChange} />
                Drinks
              </label>
              {/* Add more preferences as needed */}
            </div>
          </div>
          <button type="submit" id="save-profile-button">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;