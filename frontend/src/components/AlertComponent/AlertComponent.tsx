import React from 'react';
import './AlertComponent.css'; 

type AlertProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info'; 
  onClose?: () => void; 
};

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose }) => {
    return (
        <div className="alert-overlay">
          <div className={`alert alert-${type}`}>
            <span className="alert-message">{message}</span>
            {onClose && (
              <button className="alert-close" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        </div>
      );
};

export default Alert;