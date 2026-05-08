import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonLabel, 
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import './AdminAlerts.css';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

const AdminAlerts: React.FC = () => {
  const [alertData, setAlertData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  const handleSend = () => {
    console.log('Enviando alerta:', alertData);
    // Lógica futura: integración con servicio de mensajería
  };

  return (
    <IonPage>
      {/* Header con modo Admin activado */}
      <CustomHeader defaultHref="/AdminMenu" isAdmin={true} />

      <IonContent>
        <PageLayout>
          {/* Usamos maxWidth="800px" y fullHeight={false} para que no se estire innecesariamente */}
          <MainCard title="Enviar Alertas/Avisos" maxWidth="800px">
            
            <div className="alerts-form-container">
              
              <CustomInput 
                label="Enviar a:"
                placeholder="ejemplo@correo.com"
                value={alertData.recipient}
                onIonChange={(val) => setAlertData({...alertData, recipient: val})}
              />

              <CustomInput 
                label="Asunto"
                placeholder="Escriba el asunto del mensaje"
                value={alertData.subject}
                onIonChange={(val) => setAlertData({...alertData, subject: val})}
              />

              <div className="custom-textarea-group">
                <IonLabel position="stacked" className="custom-input-label">Mensaje</IonLabel>
                <IonTextarea 
                  placeholder="Escriba el contenido del mensaje"
                  className="muni-textarea-field"
                  rows={8}
                  value={alertData.message}
                  onIonChange={e => setAlertData({...alertData, message: e.detail.value!})}
                />
              </div>

              <div className="alerts-actions">
                <IonButton 
                  className="btn-send-alert" 
                  onClick={handleSend}
                >
                  Enviar aviso
                </IonButton>
                
                <IonButton 
                  fill="outline" 
                  className="btn-cancel-alert"
                  routerLink="/AdminMenu"
                >
                  Cancelar
                </IonButton>
              </div>

            </div>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default AdminAlerts;