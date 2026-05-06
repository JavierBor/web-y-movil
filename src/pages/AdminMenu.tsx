import React from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonCard, IonCardContent, IonIcon, IonButton 
} from '@ionic/react';
import { calendarOutline, clipboardOutline, notificationsOutline } from 'ionicons/icons';
import CustomHeader from '../components/CustomHeader';
import './MenuPrincipal.css'; // Reutilizamos los estilos de centrado

const AdminMenu: React.FC = () => {
  return (
    <IonPage>
      {/* Usamos el componente con isAdmin={true} para mostrar la etiqueta del mockup [cite: 170] */}
      <CustomHeader defaultHref="/menu-principal" isAdmin={true} />

      <IonContent className="ion-padding">
        <div className="main-center-wrapper">
          <IonGrid className="menu-grid">
            <IonRow className="ion-justify-content-center">
              
              {/* RF7: Gestionar Trámites (CRUD de trámites) [cite: 148, 176] */}
              <IonCol size="12" sizeMd="4">
                <IonCard className="main-card">
                  <IonCardContent>
                    <IonIcon icon={calendarOutline} className="card-icon" />
                    <h2>Gestionar Trámites</h2>
                    <br/>
                    <p>Gestionar a modificar los trámites solicitados en la municipalidad</p>
                    <br/>
                    <IonButton expand="block" routerLink="/admin/gestion">Agendar Cita</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Panel de Seguimiento Administrativo  */}
              <IonCol size="12" sizeMd="4">
                <IonCard className="main-card">
                  <IonCardContent>
                    <IonIcon icon={clipboardOutline} className="card-icon" />
                    <h2>Ver Tramites Pendientes</h2>
                    <br/>
                    <p>Ver el estado y seguimniento de solicitudes en curso</p>
                    <br/>
                    <IonButton expand="block" routerLink="/admin/pendientes">Ver tramites</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Sistema de Notificaciones Masivas [cite: 185] */}
              <IonCol size="12" sizeMd="4">
                <IonCard className="main-card">
                  <IonCardContent>
                    <IonIcon icon={notificationsOutline} className="card-icon" />
                    <h2>Enviar Alertas/Avisos</h2>
                    <br/>
                    <p>Envia alertas y avisos urgentes sobre citas y tramites</p>
                    <br/>
                    <IonButton expand="block" routerLink="/admin/avisos">Enviar aviso</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminMenu;