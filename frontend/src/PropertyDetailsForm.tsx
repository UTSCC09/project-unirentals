import React, { useState } from "react";
import "./PropertyDetailsForm.css";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaBuilding,
  FaInfoCircle,
  FaRuler,
} from "react-icons/fa";

interface PropertyDetailsFormProps {
  property: {
    owner: string;
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
        <h2 id="property-address">
          <FaMapMarkerAlt />
          {property.address}
        </h2>
        <p id="property-distance">
          <FaRuler />
          Distance from campus: {property.distance}
        </p>
        <p id="property-price">
          <FaDollarSign />
          Price: {property.price}
        </p>
        <p id="property-building-type">
          <FaBuilding />
          Building type: {property.buildingType}
        </p>
        <p id="property-owner">
          <FaBuilding />
          Owned by: {property.owner}
        </p>
        <p id="property-description">
          <FaInfoCircle />
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
