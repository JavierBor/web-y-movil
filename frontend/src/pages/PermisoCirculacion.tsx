import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonButton, IonIcon, 
  IonText, IonList, IonItem, IonLabel, IonBadge 
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; // 🔌 Para control de navegación y sesión
import { checkmarkCircleOutline, downloadOutline, alertCircleOutline } from 'ionicons/icons';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';
import API from '../services/api'; // 🔌 Instancia centralizada de Axios

import './PermisoCirculacion.css';

function PermisoCirculacion() {
  const history = useHistory();
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    patente: ''
  });

  // Estados para rellenar dinámicamente el comprobante de éxito
  const [folioGenerado, setFolioGenerado] = useState('');
  const [fechaTransaccion, setFechaTransaccion] = useState('');

  /**
   * FUNCIÓN CORE: Conecta con el backend Express y procesa el pago del impuesto vehicular
   */
  const handlePagar = async () => {
    if (!formData.rut || !formData.patente) {
      alert("Por favor, ingrese el RUT y la Patente del vehículo.");
      return;
    }

    // 1. Rescatamos el usuario conectado desde el LocalStorage
    const sesion = localStorage.getItem('usuario_conectado');
    if (!sesion) {
      alert("Error de sesión: Inicie sesión para efectuar el pago de su permiso.");
      history.push('/Login');
      return;
    }
    const usuario = JSON.parse(sesion);

    // 2. Formateamos las variables cronológicas del pago instantáneo
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaFormateada = hoy.toTimeString().split(' ')[0];  // HH:MM:SS

    try {
      // 3. Payload transaccional estructurado para PostgreSQL (¡Campos JSONB mapeados con éxito!)
      const payload = {
        documentos_url: null, // No requiere adjuntar archivos, es pago directo
        fecha_cita: fechaFormateada,
        hora_cita: horaFormateada,
        comprobante_url: `/uploads/comprobantes/permiso_${formData.patente.toLowerCase()}.pdf`,
        usuario_id: usuario.id,
        sucursal_id: 1,           // Edificio Consistorial Av. Sta Teresa
        tramite_id: 1,            // ID 1: Catálogo maestro - Permiso de Circulación
        tipo_tramite: 'permiso',   // Guardamos el tipo de trámite real en la BD
        datos_extra: { patente: formData.patente } // Mapeamos la patente dentro del objeto JSONB
      };

      console.log('Despachando pago de Permiso de Circulación:', payload);

      const response = await API.post('/tramites', payload);

      if (response.status === 201 || response.data.ok) {
        // Generamos un número de folio aleatorio único para el mockup del recibo
        const numFolio = Math.floor(100000 + Math.random() * 900000);
        setFolioGenerado(`PC-${numFolio}`);
        
        setFechaTransaccion(hoy.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }));

        // Activamos la pantalla del Comprobante de Pago
        setIsFinished(true);
      }

    } catch (error: any) {
      console.error('Error al registrar pago de circulación:', error);
      const msgError = error.response?.data?.mensaje || 'Hubo un problema al procesar el pago. Intente nuevamente.';
      alert(msgError);
    }
  };

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
              /* --- ESTADO 1: FORMULARIO DE CAPTURA --- */
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
              /* --- ESTADO 2: COMPROBANTE DE ÉXITO --- */
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
                      <IonLabel><small>Folio de Pago</small><p>{folioGenerado}</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Monto Total</small><p>$64.200</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Fecha de Pago</small><p>{fechaTransaccion}</p></IonLabel>
                    </IonItem>
                  </IonList>
                </div>

                <div className="aseo-actions-final">
                  <IonButton fill="clear" color="primary" onClick={() => alert('Descargando documento oficial firmado digitalmente... (Simulación)')}>
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