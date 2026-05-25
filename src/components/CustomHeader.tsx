import React, { useState } from 'react';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonImg, IonButton, IonIcon, IonPopover, IonList, 
  IonItem, IonLabel, IonText 
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { 
  personCircleOutline, chevronDownOutline, 
  settingsOutline, logOutOutline 
} from 'ionicons/icons';
import './CustomHeader.css';

interface HeaderProps {
  showBackButton?: boolean;
  defaultHref?: string;
  showAccountButton?: boolean; 
  isAdmin?: boolean;           
}

const CustomHeader: React.FC<HeaderProps> = ({ 
  showBackButton = true, 
  defaultHref = "/Login",
  showAccountButton = true,
  isAdmin = false 
}) => {
  const history = useHistory(); 

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

  const handleLogout = () => {
    console.log("幕🔴 Cerrando sesión: Limpiando LocalStorage de forma segura...");
    localStorage.removeItem('usuario_conectado');
    localStorage.removeItem('token');
    closePopover();         
    history.push('/Login'); 
  };

  return (
    <IonHeader>
      {/* 🟢 Tag de apertura correcto */}
      <IonToolbar color="primary" className="custom-toolbar">
        <IonButtons slot="start">
          {showBackButton && <IonBackButton defaultHref={defaultHref} text="Volver" />}
          <h1 className="header-web-title">Municipalidad Santo Domingo</h1>
        </IonButtons>
        
        <div className="header-logo-wrapper">
          <IonImg src="/Logo.png" className="header-logo-img" alt="Logo" />
        </div>

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
      </IonToolbar> {/* 👈 Corregido aquí: </IonToolbar> en lugar de </Toolbar> */}

      <IonPopover
        isOpen={popoverState.showPopover}
        event={popoverState.event}
        onDidDismiss={closePopover}
      >
        <IonList>
          {isAdmin ? (
            <IonItem button routerLink="/MenuPrincipal" onClick={closePopover}>
              <IonIcon slot="start" icon={personCircleOutline} />
              <IonLabel>Modo Ciudadano</IonLabel>
            </IonItem>
          ) : (
            <IonItem button routerLink="/AdminMenu" onClick={closePopover}>
              <IonIcon slot="start" icon={settingsOutline} />
              <IonLabel>Modo Administrador</IonLabel>
            </IonItem>
          )}

          <IonItem button onClick={handleLogout} lines="none">
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