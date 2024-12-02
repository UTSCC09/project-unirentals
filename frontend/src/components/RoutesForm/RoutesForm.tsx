import React from "react";
import "./RoutesForm.css";

interface RoutesFormProps {
  onBack: () => void;
  onCarClick: () => void;
  onPublicTransitClick: () => void;
  onWalkClick: () => void;
}

const RoutesForm: React.FC<RoutesFormProps> = ({
  onBack,
  onCarClick,
  onPublicTransitClick,
  onWalkClick,
}) => {
  return (
    <div className="routes-form">
      <div className="routes-form-header">
        <button className="back-button" onClick={onBack}>
        &#8249;
        </button>
        <h2 id="routes-title">Routes</h2>
        
      </div>
      <div id="routes-description">
        How would you like to get to campus?
        </div>
      <div className="routes-form-body">
        <button className="styled-button" onClick={onCarClick}>
          Car
        </button>
        <button className="styled-button" onClick={onPublicTransitClick}>
          Public Transit
        </button>
        <button className="styled-button" onClick={onWalkClick}>
          Walk
        </button>
      </div>
    </div>
  );
};

export default RoutesForm;
