import React, { useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, useIonToast, IonSpinner } from '@ionic/react';
import { 
  idCardOutline, carOutline, schoolOutline, 
  documentTextOutline, homeOutline, eyeOutline 
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import UploadItem from '../components/UploadItem';
import API from '../services/api'; // 🔌 Usamos la instancia centralizada de Axios de tu proyecto

const SubirDocumentos: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Estado estructurado para almacenar los archivos binarios reales seleccionados por el ciudadano
  const [documentos, setDocumentos] = useState<{ [key: string]: File | null }>({
    cedula: null,
    hojaVida: null,
    certificadoEstudios: null,
    antecedentes: null,
    residencia: null,
    examenesMedicos: null,
  });

  // Función reactiva que llamará cada <UploadItem /> hijo para inyectar su archivo en el estado del padre
  const handleFileChange = (idDocumento: string, archivo: File | null) => {
    setDocumentos((prev) => ({
      ...prev,
      [idDocumento]: archivo,
    }));
  };

  // 2. Función controlada para procesar el FormData multipart/form-data y enviarlo al Backend
  const handleEnviarDocumentos = async () => {
    // Validación de reglas de negocio (EF 1): Cédula de Identidad y Hoja de Conductor son obligatorias para Licencia Clase B
    if (!documentos.cedula || !documentos.hojaVida) {
      present({
        message: 'Por favor, adjunte al menos los documentos obligatorios (Cédula de Identidad y Hoja de Vida).',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Creamos el contenedor FormData indispensable para que Multer pueda interceptar y procesar archivos en Express
      const formData = new FormData();
      
      // Recuperamos los datos del ciudadano logueado desde el localStorage (según su lógica de la Entrega Parcial 2)
      const usuarioLogueadoRaw = localStorage.getItem('usuario');
      const usuario = usuarioLogueadoRaw ? JSON.parse(usuarioLogueadoRaw) : null;
      const usuarioId = usuario?.id || 1; // ID de respaldo para pruebas locales por si no ha pasado por el login

      // Estructuramos los campos req.body obligatorios para el SolicitudTramite.create de tu Backend
      formData.append('usuario_id', usuarioId.toString());
      formData.append('tramite_id', '2'); // El ID 2 corresponde a 'Obtener/Renovar Licencia Clase B' en su catálogo maestro
      formData.append('sucursal_id', '1'); // ID por defecto de la sucursal física de atención
      formData.append('tipo_tramite', 'licencia');

      // Recorremos el mapa de archivos y adjuntamos al FormData únicamente los que el ciudadano sí subió
      Object.keys(documentos).forEach((key) => {
        const file = documentos[key];
        if (file) {
          // El nombre de la propiedad ('cedula', 'hojaVida', etc.) calza perfecto con el upload.fields de tu Backend
          formData.append(key, file); 
        }
      });

      // Ejecutamos la petición HTTP POST enviando el formulario completo
      const response = await API.post('/tramites', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // <-- Obliga a Axios a enviar los archivos reales con sus boundaries nativos
        }
      });

      if (response.data.ok) {
        present({
          message: 'Expediente digital cargado y guardado correctamente.',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        
        const solicitudCreada = response.data.solicitud;
        localStorage.setItem('solicitud_id_actual', solicitudCreada.id.toString());

        history.push({
          pathname: '/seleccionar-fecha',
          state: { solicitudId: solicitudCreada.id } 
        });
      }

    } catch (error: any) {
      console.error('Error crítico al despachar expediente a Express:', error);
      present({
        message: error.response?.data?.mensaje || 'Error de comunicación: No se pudieron almacenar los documentos.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <CustomHeader defaultHref="/detalle-tramite" />
      
      <IonContent>
        <PageLayout>
          <MainCard title="Subir Documentos (Licencia Clase B)" maxWidth="1000px">
            
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', marginBottom: '30px' }}>
              Por favor, adjunte cada uno de los archivos requeridos a continuación en formato digital (PDF o imagen, JPG/PNG, max 5MB). Asegúrese de que sean legibles y actualizados.
            </p>

            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={idCardOutline} 
                    title="Cédula de Identidad Vigente" 
                    description="Vigente y en buen estado." 
                    isUploaded={!!documentos.cedula}
                    onFileSelect={(file) => handleFileChange('cedula', file)}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={carOutline} 
                    title="Hoja de Vida del Conductor" 
                    description="Se obtiene en el Registro Civil." 
                    isUploaded={!!documentos.hojaVida}
                    onFileSelect={(file) => handleFileChange('hojaVida', file)}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={schoolOutline} 
                    title="Certificado de Estudios (Mínimo 8 Básico aprobado)" 
                    description="Original o copia legalizada." 
                    isUploaded={!!documentos.certificadoEstudios}
                    onFileSelect={(file) => handleFileChange('certificadoEstudios', file)}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={documentTextOutline} 
                    title="Certificado de Antecedentes"
                    description="Verificación legal." 
                    isUploaded={!!documentos.antecedentes} 
                    onFileSelect={(file) => handleFileChange('antecedentes', file)}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={homeOutline} 
                    title="Certificado de Residencia o Comprobante de Domicilio" 
                    description="Cuenta de servicios, Registro Social de Hogares, etc." 
                    isUploaded={!!documentos.residencia}
                    onFileSelect={(file) => handleFileChange('residencia', file)}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={eyeOutline} 
                    title="Exámenes Médicos (Sensométrico y Psicométrico)" 
                    description="Aprobación obligatoria." 
                    isUploaded={!!documentos.examenesMedicos}
                    onFileSelect={(file) => handleFileChange('examenesMedicos', file)}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Cambiamos el routerLink directo por un evento onClick controlado con Spinner para evitar doble envíos */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <IonButton 
                className="btn-enviar-todo" 
                onClick={handleEnviarDocumentos}
                disabled={isLoading}
              >
                {isLoading ? <IonSpinner name="crescent" /> : 'Enviar Documentos y Continuar'}
              </IonButton>
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default SubirDocumentos;