import React, { useState } from 'react';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonImg, IonButton, IonIcon, IonPopover, IonList, 
  IonItem, IonLabel, IonText 
} from '@ionic/react';
import { 
  personCircleOutline, chevronDownOutline, 
  settingsOutline, logOutOutline 
} from 'ionicons/icons';
import './CustomHeader.css';

interface HeaderProps {
  showBackButton?: boolean;
  defaultHref?: string;
  showAccountButton?: boolean; // Para ocultar en Login/Register [cite: 79, 80]
  isAdmin?: boolean;           // Para mostrar la etiqueta 'Admin' 
}

const CustomHeader: React.FC<HeaderProps> = ({ 
  showBackButton = true, 
  defaultHref = "/Login",
  showAccountButton = true,
  isAdmin = false 
}) => {
  // Estado interno para gestionar el menú (Popover) [cite: 100]
  const [popoverState, setPopoverState] = useState<{
    showPopover: boolean,
    event: any | undefined
  }>({
    showPopover: false,
    event: undefined,
  });

  const openPopover = (e: any) => {
    setPopoverState({ showPopover: true, event: e.nativeEvent });
  };

  const closePopover = () => {
    setPopoverState({ showPopover: false, event: undefined });
  };

  return (
    <IonHeader>
      <IonToolbar color="primary" className="custom-toolbar">
        {/* LADO IZQUIERDO: Botón Inicio y Título [cite: 46] */}
        <IonButtons slot="start">
          {showBackButton && <IonBackButton defaultHref={defaultHref} text="Volver" />}
          <h1 className="header-web-title">Municipalidad Santo Domingo</h1>
        </IonButtons>
        
        {/* CENTRO: Logo con posicionamiento absoluto [cite: 47] */}
        <div className="header-logo-wrapper">
          <IonImg src="/Logo.png" className="header-logo-img" alt="Logo" />
        </div>

        {/* LADO DERECHO: Etiqueta Admin y Botón Mi Cuenta [cite: 48, 111] */}
        {showAccountButton && (
          <IonButtons slot="end">
            {isAdmin && <span className="admin-label">Admin</span>}
            <IonButton className="account-btn" onClick={openPopover}>
              <IonIcon slot="start" icon={personCircleOutline} />
              MI CUENTA
              <IonIcon slot="end" icon={chevronDownOutline} />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>

      {/* Menú Desplegable Integrado [cite: 100, 101] */}
      <IonPopover
        isOpen={popoverState.showPopover}
        event={popoverState.event}
        onDidDismiss={closePopover}
      >
        <IonList>
          {/* Renderizado condicional según el rol actual */}
          {isAdmin ? (
            // Si ya es Admin, ofrece volver al portal del usuario
            <IonItem button routerLink="/MenuPrincipal" onClick={closePopover}>
              <IonIcon slot="start" icon={personCircleOutline} />
              <IonLabel>Modo Ciudadano</IonLabel>
            </IonItem>
          ) : (
            // Si es Usuario, ofrece ir al panel de administración
            <IonItem button routerLink="/AdminMenu" onClick={closePopover}>
              <IonIcon slot="start" icon={settingsOutline} />
              <IonLabel>Modo Administrador</IonLabel>
            </IonItem>
          )}

          {/* Opción de cerrar sesión (común para ambos) */}
          <IonItem button onClick={() => { console.log("Cerrar sesión"); closePopover(); }} lines="none" routerLink='/Login'>
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonText color="danger">
              <IonLabel>Cerrar sesión</IonLabel>
            </IonText>
          </IonItem>
        </IonList>
      </IonPopover>
    </IonHeader>
  );
};

export default CustomHeader;