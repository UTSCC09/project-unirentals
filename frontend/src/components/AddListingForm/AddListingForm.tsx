import React from "react";
import "./AddListingForm.css";

interface AddListingFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddListingForm: React.FC<AddListingFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    address: "",
    school: "",
    price: "",
    housingType: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    description: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
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
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="school">School</label>
            <select
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            >
              <option value="">Select a school</option>
              <option value="School A">School A</option>
              <option value="School B">School B</option>
              <option value="School C">School C</option>
            </select>
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="housingType">Housing Type</label>
            <select
              id="housingType"
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Dormitory">Dormitory</option>
            </select>
          </div>
          <div>
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
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
              value={formData.bathrooms}
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
              value={formData.kitchens}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
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
