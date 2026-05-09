import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonButton, IonIcon, 
  IonText, IonList, IonItem, IonLabel, IonBadge 
} from '@ionic/react';
import { carOutline, checkmarkCircleOutline, downloadOutline, alertCircleOutline } from 'ionicons/icons';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

import './PermisoCirculacion.css';

function PermisoCirculacion() {
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    patente: ''
  });

  function handlePagar() {
    if (formData.rut && formData.patente) {
      setIsFinished(true);
    } else {
      alert("Por favor, ingrese el RUT y la Patente del vehículo.");
    }
  }

  return (
    <IonPage>
      <CustomHeader defaultHref="/MenuPrincipal" />

      <IonContent className="permiso-bg">
        <PageLayout>
          <MainCard 
            title={isFinished ? "Permiso Generado" : "Pago Permiso de Circulación"} 
            maxWidth="600px"
          >
            {!isFinished ? (
              <div className="permiso-container">
                <div className="info-banner">
                  <IonIcon icon={alertCircleOutline} />
                  <p>Recuerde tener su SOAP y Revisión Técnica al día antes de pagar.</p>
                </div>

                <CustomInput 
                  label="RUT del Propietario"
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onIonChange={(val) => setFormData({...formData, rut: val})}
                />

                <CustomInput 
                  label="Patente del Vehículo"
                  placeholder="AAAA11 o AA1122"
                  value={formData.patente}
                  onIonChange={(val) => setFormData({...formData, patente: val.toUpperCase()})}
                />

                <div className="permiso-actions">
                  <IonButton expand="block" className="btn-muni" onClick={handlePagar}>
                    CONSULTAR Y PAGAR
                  </IonButton>
                </div>
              </div>
            ) : (
              <div className="success-container">
                <div className="success-header">
                  <IonIcon icon={checkmarkCircleOutline} color="success" className="success-icon" />
                  <h2 className="success-title">Permiso Pagado Correctamente</h2>
                </div>

                <div className="receipt-box">
                  <IonList lines="full">
                    <IonItem>
                      <IonLabel><small>Patente</small><p>{formData.patente}</p></IonLabel>
                      <IonBadge color="primary">Vigente 2026</IonBadge>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Folio de Pago</small><p>PC-992031</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Monto Total</small><p>$64.200</p></IonLabel>
                    </IonItem>
                  </IonList>
                </div>

                <div className="aseo-actions-final">
                  <IonButton fill="clear" color="primary">
                    <IonIcon slot="start" icon={downloadOutline} />
                    Descargar Permiso PDF
                  </IonButton>
                  <IonButton expand="block" routerLink="/MenuPrincipal" className="btn-muni">
                    FINALIZAR
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

export default PermisoCirculacion;