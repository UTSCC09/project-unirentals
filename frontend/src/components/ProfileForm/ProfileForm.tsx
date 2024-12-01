import React, { useState, useEffect } from "react";
import "./ProfileForm.css";
import { getProfile, updateProfile, getProfilePicture } from "../../api/api";

// Replace with actual API base URL later
const API_BASE_URL = "http://localhost:8000";

interface ProfileFormProps {
  onClose: () => void;
  onSubmit(): void;
  onError(): void;
  email: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose, email }) => {
  const [profile, setProfile] = useState({
    id: 0,
    photo: "",
    firstname: "",
    lastname: "",
    age: "",
    pronouns: "",
    school: "",
    bio: "",
    preferences: {
      smokes: false,
      pets: false,
      drinks: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        
        setProfile({
          id: profileData.id,
          photo: profileData.profile_pic,
          firstname: profileData.first_name || "",
          lastname: profileData.last_name || "",
          age: profileData.age?.toString() || "",
          pronouns: profileData.pronouns || "",
          school: profileData.school || "",
          bio: profileData.bio || "",
          preferences: {
            smokes: profileData.smokes,
            pets: profileData.pets,
            drinks: profileData.drinks,
          },
        });

        // Fetch profile picture URL
        const pictureData = await getProfilePicture(profileData.id);
        console.log("pictureData", pictureData);
        setProfile((prevProfile) => ({
          ...prevProfile,
          photo: pictureData.url,
        }));
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [email]);

  // event handlers
  // call this whenever the input fields change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setProfile({
      ...profile,
      preferences: { ...profile.preferences, [name]: checked },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission

    const formData = new FormData();
    //formData.append("email", email);
    formData.append("photo", profile.photo);
    formData.append("firstname", profile.firstname);
    formData.append("lastname", profile.lastname);
    formData.append("age", profile.age);
    formData.append("pronouns", profile.pronouns);
    formData.append("school", profile.school);
    formData.append("bio", profile.bio);
    formData.append("smokes", profile.preferences.smokes.toString());
    formData.append("pets", profile.preferences.pets.toString());
    formData.append("drinks", profile.preferences.drinks.toString());

    console.log("profile photo: ", profile.photo);

    // Call the updateProfile function
    try {
      //console.log("Calling updateProfile with data", formData.profile.firstname);
      const response = await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error("An error occurred during profile submission", error);
    }
  };

  return (
    <div id="profile-form-container">
      <div id="profile-form">
        <span id="close-profile-form-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="profile-form-title">Edit Profile</h2>
        <div id="profile-image-container">
          {profile.photo && (
            <img src={profile.photo} alt="Profile" id="profile-image" />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div id="email">{email}</div>
          </div>
          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstname">First name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={profile.firstname}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={profile.lastname}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              min="0"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pronouns">Pronouns</label>
            <input
              type="text"
              id="pronouns"
              name="pronouns"
              value={profile.pronouns}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="school">Job/School</label>
            <input
              type="text"
              id="school"
              name="school"
              value={profile.school}
              onChange={handleInputChange}
            />
          </div>
          {/* Can add these fields back as needed 
          <div className="form-group">
            <label htmlFor="location">Looking in (Location)</label>
            <input type="text" id="location" name="location" value={profile.location} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <input type="number" id="budget" name="budget" value={profile.budget} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="moveDate">Ready to Move By</label>
            <input type="date" id="moveDate" name="moveDate" value={profile.moveDate} onChange={handleInputChange} />
          </div>
          */}
          <div className="form-group">
            <label htmlFor="bio">About Me</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-group">
            <div className="preferences">
              <label>
              Smokes
                <input
                  type="checkbox"
                  name="smokes"
                  checked={profile.preferences.smokes}
                  onChange={handleCheckboxChange}
                />
                
              </label>
              <label>
                Pets
                <input
                  type="checkbox"
                  name="pets"
                  checked={profile.preferences.pets}
                  onChange={handleCheckboxChange}
                />
                
              </label>
              <label>
                Drinks
                <input
                  type="checkbox"
                  name="drinks"
                  checked={profile.preferences.drinks}
                  onChange={handleCheckboxChange}
                />
                
              </label>
            </div>
          </div>
          <button type="submit" id="save-profile-button">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
