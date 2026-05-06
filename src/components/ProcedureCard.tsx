import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonButton, IonText } from '@ionic/react';
import './ProcedureCard.css';

interface ProcedureProps {
  title: string;
  description: string;
  icon: string;
  onDetailClick: () => void;
}

const ProcedureCard: React.FC<ProcedureProps> = ({ title, description, icon, onDetailClick }) => {
  return (
    <IonCard className="procedure-card">
      <IonCardContent>
        <div className="card-header-icon">
          <IonIcon icon={icon} />
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <IonButton fill="solid" size="small" onClick={onDetailClick} className="detail-button">
          Ver detalles
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default ProcedureCard;