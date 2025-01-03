import React, { useEffect, useState }from "react";
import "./UniversityRentalsForm.css";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaBed,
  FaToilet,
  FaBuilding,
} from "react-icons/fa";
import { getListings, Listing } from "../../api/api";

interface UniversityDetailsFormProps {
  university: string;
  universityShort: string;
  address: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRentalClick: (property: Listing) => void;
  listings: Listing[];
}

const UniversityDetailsForm: React.FC<UniversityDetailsFormProps> = ({
  university,
  universityShort,
  address,
  onClose,
  onPrevious,
  onNext,
  onRentalClick,
  listings = [],
}) => {
  console.log("UniversityDetailsForm listings: ", listings);
  // const [listings, setListings] = useState<Listing[]>([]);

  // useEffect(() => {
  //   const fetchListings = async () => {
  //     try {
  //       const listingsData = await getListings();
  //       setListings(listingsData);
  //     } catch (error) {
  //       console.error("Failed to fetch listings", error);
  //     }
  //   };
  //   fetchListings();
  // }, []);

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

          {listings
            .filter((listing) => listing.school === universityShort)
            .map((listing) => (

            <li
              key={listing.id}
              className="rental-item"
              onClick={() =>
                onRentalClick(listing)
              }
            >
              <div className="rental-details">
                <h4 className="rental-address">
                  <FaMapMarkerAlt /> {listing.address}
                  <div></div>
                  University: {listing.school}
                </h4>
                <p className="rental-type">
                  <FaBuilding /> {listing.type}
                </p>
                <p className="rental-price">
                  <FaDollarSign /> {listing.price} CAD
                </p>
                <div className="rental-icons">
                  <FaBed className="icon" /> {listing.bedrooms}
                  <FaToilet className="icon" /> {listing.bathrooms}
                </div>
              </div>
            </li>
          ))
          }
        </ul>
      </div>
    </div>
  );
};

export default UniversityDetailsForm;
