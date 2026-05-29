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
import { useHistory } from 'react-router-dom';
import { checkmarkCircleOutline, downloadOutline } from 'ionicons/icons';

// Componentes de la Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';
import API from '../services/api'; // 🔌 Conexión centralizada de Axios

import './AseoTramite.css';

function AseoTramite() {
  const history = useHistory();
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    rol: ''
  });

  // Estados transaccionales para el recibo dinámico
  const [folioGenerado, setFolioGenerado] = useState('');
  const [fechaTransaccion, setFechaTransaccion] = useState('');

  /**
   * 🚀 FUNCIÓN CORE: Conecta con Express y procesa el pago electrónico
   */
  const handleProcesarPago = async () => {
    if (!formData.rut || !formData.rol) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    // 1. Rescatamos el usuario logueado en el sistema
    const sesion = localStorage.getItem('usuario_conectado');
    if (!sesion) {
      alert("Error de autenticación: Inicie sesión para efectuar pagos.");
      history.push('/Login');
      return;
    }
    const usuario = JSON.parse(sesion);

    // 2. Capturamos la fecha actual en formato local del servidor
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaFormateada = hoy.toTimeString().split(' ')[0];  // HH:MM:SS

    try {
      // 3. Payload estructurado adaptado al nuevo modelo JSONB para Derechos de Aseo
      const payload = {
        documentos_url: null, // No requiere adjuntar archivos, es pago directo por pasarela mockup
        fecha_cita: fechaFormateada, // Registra el día exacto del pago electrónico
        hora_cita: horaFormateada,   // Registra la hora exacta del pago electrónico
        comprobante_url: `/uploads/comprobantes/aseo_${formData.rol.replace('-', '_')}.pdf`,
        usuario_id: usuario.id,
        sucursal_id: 1,              // Edificio Consistorial Av. Sta Teresa
        tramite_id: 3,               // ID 3: Catálogo maestro - Derechos de Aseo Domiciliario
        tipo_tramite: 'aseo',        // 👈 Inyectamos el tipo de trámite real para el Backend
        datos_extra: {               // 👈 Mapeamos el número de Rol dentro del objeto JSONB
          rol: formData.rol 
        }
      };

      console.log('Enviando pago de Derechos de Aseo:', payload);

      const response = await API.post('/tramites', payload);

      if (response.status === 201 || response.data.ok) {
        // Generamos datos dinámicos únicos para la vista del recibo de éxito
        const numAleatorio = Math.floor(1000 + Math.random() * 9000);
        setFolioGenerado(`#SD-2026-${numAleatorio}`);
        setFechaTransaccion(hoy.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }));

        // Cambiamos de estado para pintar el Comprobante de Éxito
        setIsFinished(true);
      }

    } catch (error: any) {
      console.error('Error al procesar el pago de aseo:', error);
      // Extrae el mensaje de error del candado del backend si el usuario ya pagó
      const msgError = error.response?.data?.mensaje || 'No se pudo completar la transacción.';
      alert(msgError);
    }
  };

  return (
    <IonPage>
      <CustomHeader defaultHref="/MenuPrincipal" showAccountButton={true} />

      <IonContent className="aseo-bg">
        <PageLayout>
          
          <MainCard 
            title={isFinished ? "Comprobante de Pago" : "Realizar Pago: Derechos de Aseo"} 
            maxWidth="600px"
          >
            
            {!isFinished ? (
              /* --- ESTADO 1: FORMULARIO DE CAPTURA --- */
              <div className="aseo-container">
                <p className="aseo-instruction">
                  Ingrese los datos de la propiedad para consultar y pagar su derecho de aseo domiciliario en la comuna de Santo Domingo.
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
                      <IonLabel><small>N° de Folio</small><p>{folioGenerado}</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Propiedad (Rol)</small><p>{formData.rol}</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Monto Pagado</small><p>$42.500</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Fecha de Transacción</small><p>{fechaTransaccion}</p></IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel><small>Estado Transacción</small><p style={{ color: 'green', fontWeight: 'bold' }}>Aprobada / Confirmada</p></IonLabel>
                    </IonItem>
                  </IonList>
                </div>

                <div className="aseo-actions-final">
                  <IonButton fill="clear" color="primary" onClick={() => alert('Descargando documento oficial de tesorería municipal... (Simulación)')}>
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