import React from 'react';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonImg, IonButton, IonIcon 
} from '@ionic/react';
import { personCircleOutline, chevronDownOutline } from 'ionicons/icons';
import './CustomHeader.css';

interface HeaderProps {
  showBackButton?: boolean;
  defaultHref?: string;
}

const CustomHeader: React.FC<HeaderProps> = ({ showBackButton = true, defaultHref = "/Login" }) => {
  return (
    <IonHeader>
      <IonToolbar color="primary" className="custom-toolbar">
        {/* LADO IZQUIERDO: Botón y Título */}
        <IonButtons slot="start">
          {showBackButton && <IonBackButton defaultHref={defaultHref} text="INICIO" />}
          <h1 className="header-web-title">Municipalidad Santo Domingo</h1>
        </IonButtons>
        
        {/* CENTRO: Logo (Usamos un div para centrarlo de forma absoluta respecto a la barra) */}
        <div className="header-logo-wrapper">
          {/* Asegúrate de que logo.png esté en la carpeta 'public' directamente */}
          <IonImg src="/Logo.png" className="header-logo-img" alt="Logo" />
        </div>

        {/* LADO DERECHO: Mi Cuenta */}
        <IonButtons slot="end">
          <IonButton className="account-btn">
            <IonIcon slot="start" icon={personCircleOutline} />
            MI CUENTA
            <IonIcon slot="end" icon={chevronDownOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default CustomHeader;