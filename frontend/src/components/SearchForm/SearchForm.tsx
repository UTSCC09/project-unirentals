import React, { useState } from "react";

const SearchForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [showFilters, setShowFilters] = useState(false);
  
    const handleFiltersToggle = () => {
      setShowFilters(!showFilters);
    };
    return (
      <div id="search-container" className="slide-up">
        <div id="search-form">
          <span id="close-search-button" onClick={onClose}>
            &times;
          </span>
          <h2 id="search-form-title">Search</h2>
          <input
            type="text"
            id="search-query"
            placeholder="Search for an address"
          />
          <a id="filters-toggle-button" onClick={handleFiltersToggle}>
            Filters
          </a>
          {showFilters && (
            <div id="filters">
              <div className="filter-group">
                <input type="text" id="price-filter" placeholder="Price" />
                <span className="filters-label">CAD</span>
                <input type="text" id="distance-filter" placeholder="Distance" />
                <span className="filters-label">km</span>
              </div>
            </div>
          )}
          <button id="search-button">Search</button>
        </div>
      </div>
    );
};

export default SearchForm;