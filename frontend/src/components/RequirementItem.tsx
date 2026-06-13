import React from 'react';
import { IonIcon } from '@ionic/react';
import './RequirementItem.css';

interface RequirementProps {
  icon: string;
  title: string;
  description: string;
}

const RequirementItem: React.FC<RequirementProps> = ({ icon, title, description }) => {
  return (
    <div className="requirement-item-box">
      <div className="requirement-icon-container">
        <IonIcon icon={icon} />
      </div>
      <div className="requirement-text-container">
        <h4 className="requirement-item-title">{title}</h4>
        <p className="requirement-item-desc">{description}</p>
      </div>
    </div>
  );
};

export default RequirementItem;