import React from "react";
import "./AddListing.css";

interface AddListingButtonProps {
  onClick: () => void; // Function to handle button click
}

const AddListingButton: React.FC<AddListingButtonProps> = ({ onClick }) => {
  return (
    <button className="add-listing-btn" onClick={onClick}>
      + Add Listing
    </button>
  );
};

export default AddListingButton;