import { 
  IonContent, 
  IonPage, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton, 
  IonIcon 
} from '@ionic/react';
import { 
  calendarOutline, 
  clipboardOutline, 
  notificationsOutline, 
  alertCircleOutline,
  closeOutline
} from 'ionicons/icons';

// Componentes de la Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';

import './MenuDashboard.css'; // Crearemos un CSS compartido para ambos menús

function MenuPrincipal() {
  return (
    <IonPage>
      <CustomHeader showBackButton={false} />

      <IonContent className="dashboard-bg">
        <PageLayout>
          {/* Un poco de padding superior para centrar verticalmente en la pantalla */}
          <div className="dashboard-container">
            
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                
                {/* TARJETA 1: Agendar */}
                <IonCol size="12" sizeMd="4">
                  <MainCard maxWidth="100%" fullHeight={true}>
                    <div className="dash-card-content">
                      <IonIcon icon={calendarOutline} className="dash-icon" />
                      <h2 className="dash-title">Agendar Tramite</h2>
                      <p className="dash-desc">
                        Accede al catalogo de tramites para filtrar por sucursal y ver requisitos
                      </p>
                      <IonButton expand="block" className="dash-btn" routerLink="/agendar">
                        AGENDAR CITA
                      </IonButton>
                    </div>
                  </MainCard>
                </IonCol>

                {/* TARJETA 2: Mis Trámites */}
                <IonCol size="12" sizeMd="4">
                  <MainCard maxWidth="100%" fullHeight={true}>
                    <div className="dash-card-content">
                      <IonIcon icon={clipboardOutline} className="dash-icon" />
                      <h2 className="dash-title">Ver Tramites Pendientes</h2>
                      <p className="dash-desc">
                        Consulta el estado y seguimiento de tus solicitudes en curso
                      </p>
                      <IonButton expand="block" className="dash-btn" routerLink="/mis-tramites">
                        VER TRAMITES
                      </IonButton>
                    </div>
                  </MainCard>
                </IonCol>

                {/* TARJETA 3: Notificaciones */}
                <IonCol size="12" sizeMd="4">
                  <MainCard maxWidth="100%" fullHeight={true}>
                    <div className="dash-card-content relative-icon">
                      {/* El puntito rojo de notificación */}
                      <div className="notification-dot"></div>
                      <IonIcon icon={notificationsOutline} className="dash-icon" />
                      
                      <h2 className="dash-title">Notificaciones Pendientes</h2>
                      <p className="dash-desc">
                        Recibe alertas y avisos urgentes sobre tus citas y tramites
                      </p>
                      <IonButton expand="block" className="dash-btn" routerLink="/mis-notificaciones">
                        VER NOTIFICACIONES
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
}

export default MenuPrincipal;