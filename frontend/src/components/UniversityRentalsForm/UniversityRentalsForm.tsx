import React from "react";
import "./UniversityRentalsForm.css";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaBed,
  FaToilet,
  FaBuilding,
} from "react-icons/fa";

interface UniversityDetailsFormProps {
  university: string;
  address: string;
  rentals: string[];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRentalClick: (property: {
    owner: string;
    address: string;
    distance: string;
    price: string;
    buildingType: string;
    description: string;
  }) => void;
}

const UniversityDetailsForm: React.FC<UniversityDetailsFormProps> = ({
  university,
  address,
  rentals,
  onClose,
  onPrevious,
  onNext,
  onRentalClick,
}) => {
  const handleRentalClick = (rental: string) => {
    const property = {
      address: rental,
      owner: "John Doe",
      distance: "1 km",
      price: "$1000/month",
      buildingType: "Apartment",
      description: "A nice place to live.",
    };
    onRentalClick(property);
  };

  return (
    <div id="university-details-container">
      <div id="university-details-form">
        <span id="close-university-details-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="university-name">{university}</h2>
        <p id="university-address">{address}</p>
        <h3 id="nearby-rentals-title">Nearby Rentals</h3>
        <ul id="rentals-list">
          {rentals.map((rental, index) => (
            <li
              key={index}
              className="rental-item"
              onClick={() => handleRentalClick(rental)}
            >
              <div className="rental-details">
                <h4 className="rental-address">
                  <FaMapMarkerAlt /> 123 Main Street, Scarborough Ontario
                </h4>
                <p className="rental-type">
                  <FaBuilding /> Apartment
                </p>
                <p className="rental-price">
                  <FaDollarSign /> 1000/month
                </p>
                <div className="rental-icons">
                  <FaBed className="icon" />
                  <FaToilet className="icon" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UniversityDetailsForm;
