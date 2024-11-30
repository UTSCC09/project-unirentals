import React from "react";
import "./AddListingForm.css";
import { addListing } from "../../api/api";

interface AddListingFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const AddListingForm: React.FC<AddListingFormProps> = ({ onSubmit, onCancel }) => {
  const [listing, setListing] = React.useState({
    owner: "",
    address: "",
    school: "",
    longitude: "",
    latitude: "",
    price: "",
    housingType: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    description: "",
    preferences: {
      pets: false,
      smokes: false,
      drinks: false,
    },
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setListing({
      ...listing,
      preferences: { ...listing.preferences, [name]: checked },
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("owner", listing.owner);
    formData.append("address", listing.address);
    formData.append("school", listing.school);
    formData.append("longitude", listing.longitude);
    formData.append("latitude", listing.latitude);
    formData.append("price", listing.price);
    formData.append("type", listing.housingType);
    formData.append("bedrooms", listing.bedrooms);
    formData.append("bathrooms", listing.bathrooms);
    formData.append("kitchens", listing.kitchens);
    formData.append("description", listing.description);
    formData.append("pets", listing.preferences.pets.toString());
    formData.append("smokes", listing.preferences.smokes.toString());
    formData.append("drinks", listing.preferences.drinks.toString());
    //change these
    formData.append("longitude", "-79.1864");
    formData.append("latitude", "43.7845");

    try {
      const response = await addListing(formData);
      if (response) {
        onSubmit();
      } else {
        console.error("Error adding listing");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
  };

  return (
    <>
      
      <div className="overlay" onClick={onCancel}></div>
      
      <div className="popup-form">
        <div className="listing-title">Add Listing</div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={listing.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="school">School</label>
            <select
              id="school"
              name="school"
              value={listing.school}
              onChange={handleChange}
              required
            >
              <option value="">Select a school</option>
              <option value="UTSG">UTSG</option>
              <option value="UTSC">UTSC</option>
              <option value="UTM">UTM</option>
            </select>
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={listing.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="housingType">Housing Type</label>
            <select
              id="housingType"
              name="housingType"
              value={listing.housingType}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Basement">Basement</option>
              <option value="Room">Room</option>

            </select>
          </div>
          <div>
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={listing.bedrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={listing.bathrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="kitchens">Kitchens</label>
            <input
              type="number"
              id="kitchens"
              name="kitchens"
              value={listing.kitchens}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={listing.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="preferences">
              <label>
                Smokes
                <input
                  type="checkbox"
                  name="smokes"
                  checked={listing.preferences.smokes}
                  onChange={handleCheckboxChange}
                />
              </label>
              <label>
                Pets
                <input
                  type="checkbox"
                  name="pets"
                  checked={listing.preferences.pets}
                  onChange={handleCheckboxChange}
                />
                
              </label>
              <label>
                Drinks
                <input
                  type="checkbox"
                  name="drinks"
                  checked={listing.preferences.drinks}
                  onChange={handleCheckboxChange}
                />
                
              </label>
            </div>
          <button type="submit" className="submit-listing">Add Listing</button>
          
        </form>
        <button 
          type="button" 
          onClick={onCancel} 
          className="cancel-button"
        >
          &times;
        </button>
      </div>
    </>
  );
};

export default AddListingForm;
