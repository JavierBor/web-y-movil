import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons, 
  IonBackButton, IonImg, IonButton, IonIcon, IonGrid, IonRow, 
  IonCol, IonCard, IonCardContent, IonText, IonList, IonItem, IonPopover 
} from '@ionic/react';
import { 
  personCircleOutline, chevronDownOutline, calendarOutline, 
  clipboardOutline, notificationsOutline, alertCircleOutline, 
  closeOutline, logOutOutline, settingsOutline 
} from 'ionicons/icons';
import './MenuPrincipal.css';
import CustomHeader from '../components/CustomHeader';

const MenuPrincipal: React.FC = () => {
  const [popoverState, setPopoverState] = useState({ showPopover: false, event: undefined });

  // Funciones para el menú de "Mi Cuenta"
  const openPopover = (e: any) => {
    setPopoverState({ showPopover: true, event: e.nativeEvent });
  };

  const closePopover = () => {
    setPopoverState({ showPopover: false, event: undefined });
  };

  return (
    <IonPage>
      <CustomHeader showBackButton={false} />

      {/* Popover solicitado: Modo Administrador y Cerrar Sesión */}
      <IonPopover
        isOpen={popoverState.showPopover}
        event={popoverState.event}
        onDidDismiss={closePopover}
      >
        <IonList>
          <IonItem button routerLink="/admin-dashboard" onClick={closePopover}>
            <IonIcon slot="start" icon={settingsOutline} />
            Modo Administrador
          </IonItem>
          <IonItem button onClick={() => { console.log("Cerrando sesión"); closePopover(); }} lines="none">
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonText color="danger">Cerrar sesión</IonText>
          </IonItem>
        </IonList>
      </IonPopover>

      <IonContent className="ion-padding">
        <IonGrid className="menu-grid">
          <IonRow>
            {/* RF1 y RF3: Agendar Trámite */}
            <IonCol size="12" sizeMd="4">
              <IonCard className="main-card" routerLink="/agendar">
                <IonCardContent>
                  <IonIcon icon={calendarOutline} className="card-icon" />
                  <h2>Agendar Tramite</h2>
                  <br/>
                  <p>Accede al catalogo de tramites para filtrar por sucursal y ver requisitos</p>
                  <br/>
                  <IonButton expand="block" routerLink="\tramites">Agendar Cita</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* RF6: Ver Trámites Pendientes */}
            <IonCol size="12" sizeMd="4">
              <IonCard className="main-card" routerLink="/tramites-pendientes">
                <IonCardContent>
                  <IonIcon icon={clipboardOutline} className="card-icon" />
                  <h2>Ver Tramites Pendientes</h2>
                  <br/>
                  <p>Consulta el estado y seguimiento de tus solicitudes en curso</p>
                  <br/>
                  <IonButton expand="block">Ver tramites</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Sistema de Notificaciones */}
            <IonCol size="12" sizeMd="4">
              <IonCard className="main-card">
                <IonCardContent>
                  <div className="notif-badge-container">
                    <IonIcon icon={notificationsOutline} className="card-icon" />
                    <div className="red-dot"></div>
                  </div>
                  <h2>Notificaciones Pendientes</h2>
                   <br/>
                  <p>Recibe alertas y avisos urgentes sobre tus citas y tramites</p>
                   <br/>
                  {/* Alerta de recordatorio según mockup */}
                  <div className="notif-alert">
                    <IonIcon icon={alertCircleOutline} slot="start" />
                    <IonText>
                      <small>Recordatorio: Cita mañana a las 10:00 AM</small>
                    </IonText>
                    <IonIcon icon={closeOutline} className="close-alert" />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MenuPrincipal;