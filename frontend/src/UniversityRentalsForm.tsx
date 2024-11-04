import React from "react";
import "./UniversityRentalsForm.css";

interface UniversityDetailsFormProps {
    university: string;
    address: string;
    rentals: string[];
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onRentalClick: (property: {
      name: string;
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
        name: rental,
        address: "123 Main St",
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
            <li key={index} className="rental-item" onClick={() => handleRentalClick(rental)}>
              {rental}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UniversityDetailsForm;