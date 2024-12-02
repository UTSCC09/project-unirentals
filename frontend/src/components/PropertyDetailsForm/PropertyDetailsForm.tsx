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
import { Listing } from "../../api/api";

interface PropertyDetailsFormProps {
  property: Listing;
  onClose: () => void;
  onBack: () => void;
  onFindRoommates: () => void;
  onRouteToSchoolClick: () => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  property,
  onClose,
  onBack,
  onFindRoommates,
  onRouteToSchoolClick,
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
        <div id="property-address">
          <FaMapMarkerAlt />
          {property.address}
        </div>
        <div className="component" id="property-distance">
          <FaRuler />
          Distance from campus: {property.distance}km
        </div>
        <div className="component" id="property-price">
          <FaDollarSign />
          Price: {property.price}
        </div>
        <div className="component" id="property-building-type">
          <FaBuilding />
          Building type: {property.type}
        </div>
        <div className="component" id="property-owner">
          <FaUser />
          Owned by: {property.owner}
        </div>
        <div className="component" id="property-bedrooms">
          <FaBed />
          Bedrooms: {property.bedrooms}
        </div>
        <div className="component" id="property-bathrooms">
          <FaToilet />
          Bathrooms: {property.bathrooms}
        </div>
        <div className="component property-icons">
          <p>This property allows:</p>
          {property.pets && <FaPaw className="icon" title="Pets allowed" />}
          {property.smokes && <FaSmoking className="icon" title="Smoking allowed" />}
          {property.drinks && <FaWineGlass className="icon" title="Drinks allowed" />}
        </div>
        <div className="component" id="property-description">
          <FaInfoCircle />
          Description: {property.description}
          {showMoreInfo && <span> (More information about the property)</span>}
        </div>
        <div id="toggle-more-info-button" onClick={handleToggleMoreInfo}>
          {showMoreInfo ? "Show less" : "Show more"}
        </div>

        <button className="styled-button" id="routes-to-school-button" onClick={onRouteToSchoolClick} >Routes to school</button>
        <button id="find-roommates-button" onClick={onFindRoommates}>Find Roommates</button>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
