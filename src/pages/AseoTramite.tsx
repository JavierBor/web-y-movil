import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonIcon, 
  IonText,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { checkmarkCircleOutline, arrowBackOutline, downloadOutline } from 'ionicons/icons';

// Componentes de la Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

import './AseoTramite.css';

function AseoTramite() {
  // 1. ESTADOS: Manejo de datos y flujo de la vista
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    rol: ''
  });

  // 2. LÓGICA: Simulación de procesamiento
  function handleProcesarPago() {
    if (formData.rut && formData.rol) {
      // Aquí iría la llamada a la API en el futuro
      setIsFinished(true);
    } else {
      alert("Por favor, complete todos los campos.");
    }
  }

  return (
    <IonPage>
      <CustomHeader defaultHref="/MenuPrincipal" showAccountButton={true} />

      <IonContent className="aseo-bg">
        <PageLayout>
          
          {/* El MainCard actúa como contenedor dinámico */}
          <MainCard 
            title={isFinished ? "Comprobante de Pago" : "Realizar Pago: Derechos de Aseo"} 
            maxWidth="600px"
          >
            
            {!isFinished ? (
              /* --- ESTADO 1: FORMULARIO DE CAPTURA --- */
              <div className="aseo-container">
                <p className="aseo-instruction">
                  Ingrese los datos de la propiedad para consultar y pagar su derecho de aseo domiciliario.
                </p>

                <CustomInput 
                  label="RUT del Propietario"
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onIonChange={(val) => setFormData({...formData, rut: val})}
                />

                <CustomInput 
                  label="Número de Rol (Avalúo)"
                  placeholder="Ej: 1234-5"
                  value={formData.rol}
                  onIonChange={(val) => setFormData({...formData, rol: val})}
                />

                <div className="aseo-actions">
                  <IonButton expand="block" className="btn-muni" onClick={handleProcesarPago}>
                    CONSULTAR Y PAGAR
                  </IonButton>
                </div>
              </div>
            ) : (
              /* --- ESTADO 2: COMPROBANTE DE ÉXITO --- */
              <div className="success-container">
                <div className="success-header">
                  <IonIcon icon={checkmarkCircleOutline} color="success" className="success-icon" />
                  <IonText color="success">
                    <h2 className="success-title">¡Pago Realizado con Éxito!</h2>
                  </IonText>
                </div>

                <div className="receipt-box">
                  <IonList lines="full">
                    <IonItem>
                      <IonLabel><small>N° de Folio</small><p>#SD-2026-8842</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Propiedad (Rol)</small><p>{formData.rol}</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Monto Pagado</small><p>$42.500</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Fecha de Transacción</small><p>09 de Mayo, 2026</p></IonLabel>
                    </IonItem>
                  </IonList>
                </div>

                <div className="aseo-actions-final">
                  <IonButton fill="clear" color="primary">
                    <IonIcon slot="start" icon={downloadOutline} />
                    Descargar PDF
                  </IonButton>
                  
                  <IonButton expand="block" routerLink="/MenuPrincipal" className="btn-muni">
                    VOLVER AL MENÚ
                  </IonButton>
                </div>
              </div>
            )}

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
}

export default AseoTramite;