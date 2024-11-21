import React, { useState } from "react";
import "./PropertyDetailsForm.css";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaBuilding,
  FaInfoCircle,
  FaRuler,
  FaUser,
  FaBed,
  FaToilet,
  FaPaw,
  FaSmoking,
  FaWineGlass,
} from "react-icons/fa";
import { Listing } from "./api";

interface PropertyDetailsFormProps {
  property: Listing;
  onClose: () => void;
  onBack: () => void;
  onFindRoommates: () => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  property,
  onClose,
  onBack,
  onFindRoommates,
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
          {property.address}
        </h2>
        <p id="property-distance">
          <FaRuler />
          Distance from campus: {property.distance}
        </p>
        <p id="property-coordinates">
          <FaMapMarkerAlt />
          Coordinates: {property.latitude}, {property.longitude}
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
          <FaUser />
          Owned by: {property.owner}
        </p>
        <p id="property-bedrooms">
          <FaBed />
          Bedrooms: {property.bedrooms}
        </p>
        <p id="property-bathrooms">
          <FaToilet />
          Bathrooms: {property.bathrooms}
        </p>
        <div className="property-icons">
          <p>This property allows:</p>
          {property.pets && <FaPaw className="icon" title="Pets allowed" />}
          {property.smokes && <FaSmoking className="icon" title="Smoking allowed" />}
          {property.drinks && <FaWineGlass className="icon" title="Drinks allowed" />}
        </div>
        <p id="property-description">
          <FaInfoCircle />
          Description: {property.description}
          {showMoreInfo && <span> (More information about the property)</span>}
        </p>
        <a id="toggle-more-info-button" onClick={handleToggleMoreInfo}>
          {showMoreInfo ? "Show less" : "Show more"}
        </a>

        <button id="find-roommates-button" onClick={onFindRoommates}>Find Roommates</button>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
