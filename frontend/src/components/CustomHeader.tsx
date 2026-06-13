// src/components/CustomHeader.tsx
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
import { useHistory, useLocation } from 'react-router-dom';   // ← añadido useLocation
import { useAuth } from '../context/AuthContext';
import './CustomHeader.css';

interface HeaderProps {
  showBackButton?:    boolean;
  defaultHref?:       string;
  showAccountButton?: boolean;
  isAdmin?:           boolean;
}

const CustomHeader: React.FC<HeaderProps> = ({
  showBackButton    = true,
  defaultHref       = '/Login',
  showAccountButton = true,
  isAdmin: isAdminProp,
}) => {
  const history = useHistory();
  const location = useLocation();                           // ← obtener ruta actual
  const { user, logout, isAdmin: isAdminFn } = useAuth();

  const isAdmin = isAdminProp !== undefined ? isAdminProp : isAdminFn();

  // Determinar si la ruta actual pertenece al panel de administrador
  const esRutaAdmin = location.pathname.startsWith('/Admin') ||
                      location.pathname.startsWith('/admin');

  const [popoverState, setPopoverState] = useState<{
    showPopover: boolean;
    event: any | undefined;
  }>({ showPopover: false, event: undefined });

  const openPopover  = (e: any) =>
    setPopoverState({ showPopover: true, event: e.nativeEvent });
  const closePopover = () =>
    setPopoverState({ showPopover: false, event: undefined });

  const handleLogout = () => {
    closePopover();
    logout();
    window.location.href = '/Login'; // redirige a Login tras cerrar sesión
  };

  return (
    <IonHeader>
      <IonToolbar color="primary" className="custom-toolbar">
        <IonButtons slot="start">
          {showBackButton && (
            <IonBackButton defaultHref={defaultHref} text="Volver" />
          )}
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
      </IonToolbar>

      <IonPopover
        isOpen={popoverState.showPopover}
        event={popoverState.event}
        onDidDismiss={closePopover}
      >
        <IonList>
          {/* Cambio de modo basado en la ruta actual, no en isAdmin */}
          {user?.rol === 'admin' && (
            esRutaAdmin ? (
              <IonItem button routerLink="/MenuPrincipal" onClick={closePopover}>
                <IonIcon slot="start" icon={personCircleOutline} />
                <IonLabel>Modo Ciudadano</IonLabel>
              </IonItem>
            ) : (
              <IonItem button routerLink="/AdminMenu" onClick={closePopover}>
                <IonIcon slot="start" icon={settingsOutline} />
                <IonLabel>Modo Administrador</IonLabel>
              </IonItem>
            )
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