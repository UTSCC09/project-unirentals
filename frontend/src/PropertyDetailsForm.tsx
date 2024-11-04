import React, { useState } from "react";
import "./PropertyDetailsForm.css";

interface PropertyDetailsFormProps {
  property: {
    name: string;
    address: string;
    distance: string;
    price: string;
    buildingType: string;
    description: string;
  };
  onClose: () => void;
  onBack: () => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  property,
  onClose,
  onBack,
}) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const handleToggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div id="property-details-container">
      <div id="property-details-form">
        <span id="back-button" onClick={onBack}>
          &#8249;
        </span>
        <h2 id="property-name">{property.name}</h2>
        <p id="property-address">{property.address}</p>
        <p id="property-distance">Distance from campus: {property.distance}</p>
        <p id="property-price">Price: {property.price}</p>
        <p id="property-building-type">Building type: {property.buildingType}</p>
        <p id="property-description">
          Description: {property.description}
          {showMoreInfo && <span> (More information about the property)</span>}
        </p>
        <a id="toggle-more-info-button" onClick={handleToggleMoreInfo}>
          {showMoreInfo ? "Show less" : "Show more"}
        </a>
        <button id="find-roommates-button">Find Roommates</button>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;