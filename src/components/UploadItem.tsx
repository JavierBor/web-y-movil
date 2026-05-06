import React from 'react';
import { IonIcon, IonButton, IonText } from '@ionic/react';
import { timeOutline, checkmarkCircle } from 'ionicons/icons';
import './UploadItem.css';

interface UploadProps {
  icon: string;
  title: string;
  description: string;
  isUploaded?: boolean;
}

const UploadItem: React.FC<UploadProps> = ({ icon, title, description, isUploaded = false }) => {
  return (
    <div className="upload-item-box">
      {/* Indicador de Estado Superior Derecho */}
      <div className="status-indicator">
        <IonText className="status-text">{isUploaded ? '' : 'pendiente'}</IonText>
        <IonIcon 
          icon={isUploaded ? checkmarkCircle : 'circle'} 
          className={isUploaded ? 'icon-success' : 'icon-pending'} 
        />
      </div>

      <div className="upload-main-content">
        <div className="upload-icon-container">
          <IonIcon icon={icon} />
        </div>
        <div className="upload-text-container">
          <h4 className="upload-item-title">{title}</h4>
          <p className="upload-item-desc">{description}</p>
        </div>
      </div>

      {/* Selector de Archivo Estilo Browser */}
      <div className="file-input-container">
        <div className="custom-browser">
          <span className="browse-label">Browse File</span>
          <span className="file-name-placeholder">Ningun archivo seleccionado.</span>
        </div>
        <IonButton size="small" className="btn-subir">Subir</IonButton>
      </div>
    </div>
  );
};

export default UploadItem;