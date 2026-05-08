import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonIcon, 
  IonButton 
} from '@ionic/react';
import { 
  calendarOutline, 
  clipboardOutline, 
  notificationsOutline 
} from 'ionicons/icons';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';

// Usamos el mismo CSS que el menú de usuario para mantener consistencia
import './MenuDashboard.css'; 

const AdminMenu: React.FC = () => {
  return (
    <IonPage>
      {/* Header en modo Admin sin botón de volver para que sea el menú raíz */}
      <CustomHeader showBackButton={false} isAdmin={true} />

      <IonContent className="dashboard-bg">
        <PageLayout>
          <div className="dashboard-container">
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                
                {/* TARJETA 1: Gestionar Trámites */}
                <IonCol size="12" sizeMd="4">
                  <MainCard maxWidth="100%" fullHeight={true}>
                    <div className="dash-card-content">
                      <IonIcon icon={calendarOutline} className="dash-icon" />
                      <h2 className="dash-title">Gestionar Trámites</h2>
                      <p className="dash-desc">
                        Gestiona o modifica el catálogo de trámites disponibles en la municipalidad.
                      </p>
                      <IonButton expand="block" className="dash-btn" routerLink="/admin/gestion">
                        GESTIONAR
                      </IonButton>
                    </div>
                  </MainCard>
                </IonCol>

                {/* TARJETA 2: Panel de Seguimiento Administrativo */}
                <IonCol size="12" sizeMd="4">
                  <MainCard maxWidth="100%" fullHeight={true}>
                    <div className="dash-card-content">
                      <IonIcon icon={clipboardOutline} className="dash-icon" />
                      <h2 className="dash-title">Trámites Pendientes</h2>
                      <p className="dash-desc">
                        Revisa el estado, audita documentos y haz seguimiento de solicitudes de ciudadanos en curso.
                      </p>
                      <IonButton expand="block" className="dash-btn" routerLink="/admin/pendientes">
                        VER BANDEJA
                      </IonButton>
                    </div>
                  </MainCard>
                </IonCol>

                {/* TARJETA 3: Sistema de Notificaciones Masivas */}
                <IonCol size="12" sizeMd="4">
                  <MainCard maxWidth="100%" fullHeight={true}>
                    <div className="dash-card-content">
                      <IonIcon icon={notificationsOutline} className="dash-icon" />
                      <h2 className="dash-title">Enviar Alertas/Avisos</h2>
                      <p className="dash-desc">
                        Envía alertas generales o avisos urgentes específicos sobre citas a los ciudadanos.
                      </p>
                      <IonButton expand="block" className="dash-btn" routerLink="/admin/avisos">
                        ENVIAR AVISO
                      </IonButton>
                    </div>
                  </MainCard>
                </IonCol>

              </IonRow>
            </IonGrid>
          </div>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default AdminMenu;