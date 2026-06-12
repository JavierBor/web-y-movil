import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonLabel, 
  IonTextarea,
  IonToast,
  IonSpinner
} from '@ionic/react';
import './AdminAlerts.css';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

// 🔌 Importamos tu instancia centralizada de Axios
import API from '../services/api'; 

const AdminAlerts: React.FC = () => {
  const [alertData, setAlertData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  // Estados para controlar el feedback de la interfaz
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const handleSend = async () => {
    // Validación básica antes de salir del cliente
    if (!alertData.recipient.trim() || !alertData.subject.trim() || !alertData.message.trim()) {
      setToastMessage('Por favor, rellene todos los campos del formulario.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);
    console.log('Disparando petición HTTP al backend con Axios:', alertData);

    try {
      // 🚀 Consumimos el endpoint usando tu interceptor que ya maneja los tokens JWT
      const response = await API.post('/tramites/enviar-aviso', alertData);

      if (response.data.success) {
        setToastMessage('¡Alerta y correo electrónico despachados con éxito!');
        setToastColor('success');
        setShowToast(true);
        // Limpiamos el formulario tras el éxito
        setAlertData({ recipient: '', subject: '', message: '' });
      }
    } catch (error: any) {
      console.error('Error capturado en la vista:', error);
      // Extrae el mensaje centralizado procesado por tu interceptor de respuestas
      setToastMessage(error.message || 'Error inesperado al despachar la alerta.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      {/* Header con modo Admin activado */}
      <CustomHeader defaultHref="/AdminMenu" isAdmin={true} />

      <IonContent>
        <PageLayout>
          <MainCard title="Enviar Alertas/Avisos" maxWidth="800px">
            
            <div className="alerts-form-container">
              
              <CustomInput 
                label="Enviar a:"
                placeholder="ejemplo@correo.com"
                value={alertData.recipient}
                onIonChange={(val) => setAlertData({...alertData, recipient: val})}
                disabled={loading}
              />

              <CustomInput 
                label="Asunto"
                placeholder="Escriba el asunto del mensaje"
                value={alertData.subject}
                onIonChange={(val) => setAlertData({...alertData, subject: val})}
                disabled={loading}
              />

              <div className="custom-textarea-group">
                <IonLabel position="stacked" className="custom-input-label">Mensaje</IonLabel>
                <IonTextarea 
                  placeholder="Escriba el contenido del mensaje"
                  className="muni-textarea-field"
                  rows={8}
                  value={alertData.message}
                  onIonChange={e => setAlertData({...alertData, message: e.detail.value!})}
                  disabled={loading}
                />
              </div>

              <div className="alerts-actions">
                <IonButton 
                  className="btn-send-alert" 
                  onClick={handleSend}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                      Enviando...
                    </>
                  ) : (
                    'Enviar aviso'
                  )}
                </IonButton>
                
                <IonButton 
                  fill="outline" 
                  className="btn-cancel-alert"
                  routerLink="/AdminMenu"
                  disabled={loading}
                >
                  Cancelar
                </IonButton>
              </div>

            </div>

          </MainCard>
        </PageLayout>
      </IonContent>

      {/* 🔔 Feedback visual flotante */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={4000}
        color={toastColor}
        position="top"
      />
    </IonPage>
  );
};

export default AdminAlerts;