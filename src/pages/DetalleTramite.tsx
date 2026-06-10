import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonSpinner, IonText } from '@ionic/react';
import { 
  idCardOutline, carOutline, schoolOutline, 
  documentTextOutline, homeOutline, medicalOutline 
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import RequirementItem from '../components/RequirementItem';
import API from '../services/api';
import './DetalleTramite.css';

const DetalleTramite: React.FC = () => {
  const history = useHistory();
  
  // Estados de control para la regla de negocio (EF 1)
  const [isBloqueado, setIsBloqueado] = useState<boolean>(false);
  const [mensajeBloqueo, setMensajeBloqueo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Estados reactivos para guiar al ciudadano según si tiene la hora pendiente o no
  const [urlSiguiente, setUrlSiguiente] = useState<string>('/subir-documentos');
  const [textoBoton, setTextoBoton] = useState<string>('Continuar');

   // Valida detalladamente si hay una cita agendada o si quedó un proceso con hora pendiente
  useEffect(() => {
    const verificarTramiteActivoAlInicio = async () => {
      const sesion = localStorage.getItem('usuario_conectado'); 
      if (!sesion) {
        setLoading(false);
        return;
      }
      
      try {
        const usuario = JSON.parse(sesion);
        const response = await API.get(`/tramites/usuario/${usuario.id}`);
        const solicitudesUser = response.data.solicitudes || [];

        // CONDICIÓN A: El usuario ya completó el asistente y tiene una cita agendada (con fecha válida)
        const tieneCitaAgendada = solicitudesUser.some((solicitud: any) => {
          const estado = solicitud.estado_tramite?.toLowerCase() || solicitud.estado?.toLowerCase() || '';
          const tieneFecha = solicitud.fecha_cita !== null && solicitud.fecha_cita !== '';
          return solicitud.tramite_id === 2 && 
                 (estado === 'pendiente' || estado === 'en espera' || estado === 'confirmado') && 
                 tieneFecha;
        });

        if (tieneCitaAgendada) {
          setIsBloqueado(true);
          setMensajeBloqueo(
            "Ya cuentas con una solicitud de Licencia de Conducir Clase B activa con una cita agendada en el sistema. No se permite registrar múltiples agendas simultáneas hasta que la actual sea resuelta por la administración municipal."
          );
        } else {
          setIsBloqueado(false);

          // CONDICIÓN B: El usuario subió documentos previamente, pero dejó la HORA PENDIENTE
          const borradorConHoraPendiente = solicitudesUser.find((solicitud: any) => {
            const estado = solicitud.estado_tramite?.toLowerCase() || solicitud.estado?.toLowerCase() || '';
            const tieneFecha = solicitud.fecha_cita !== null && solicitud.fecha_cita !== '';
            return solicitud.tramite_id === 2 && estado === 'pendiente' && !tieneFecha;
          });

          if (borradorConHoraPendiente) {
            console.log("Se detectó documentos ya cargados con hora pendiente. Reutilizando ID:", borradorConHoraPendiente.id);
            // Resguardamos el ID en el localStorage para que la pantalla de la agenda sepa a qué fila hacerle el PUT
            localStorage.setItem('solicitud_id_actual', borradorConHoraPendiente.id.toString());
            // Flujo inteligente: Saltamos directo al calendario
            setUrlSiguiente('/seleccionar-fecha');
            setTextoBoton('Continuar hacia la Agenda (Hora Pendiente)');
          } else {
            // Si no hay borradores intermedios, limpiamos la llave y permitimos el flujo estándar desde el paso 1
            localStorage.removeItem('solicitud_id_actual');
            setUrlSiguiente('/subir-documentos');
            setTextoBoton('Continuar');
          }
        }
      } catch (error) {
        console.error('Error al validar restricciones en DetalleTramite:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarTramiteActivoAlInicio();
  }, []);

  if (loading) {
    return (
      <IonPage>
        <CustomHeader defaultHref="/Tramites" />
        <IonContent>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ color: '#666', marginTop: '15px' }}>Validando estado de unificación...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <CustomHeader defaultHref="/Tramites" />
      
      <IonContent>
        <PageLayout>
          <MainCard title="Tramite: Primera Licencia de Conducir Clase B" maxWidth="900px">
            
            {isBloqueado ? (
              <div className="bloqueo-container" style={{ padding: '30px 20px', textAlign: 'center' }}>
                <IonText color="danger">
                  <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>⚠️ Solicitud Activa Detectada</h3>
                </IonText>
                <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
                  {mensajeBloqueo}
                </p>
                <IonButton color="primary" style={{ minWidth: '200px' }} routerLink="/MenuPrincipal">
                  Volver al Menú Principal
                </IonButton>
              </div>
            ) : (
              <>
                <p className="docs-subtitle">Documentos y Requisitos</p>

                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <RequirementItem 
                        icon={idCardOutline} 
                        title="Cedula de Identidad Vigente" 
                        description="Vigente y en buen estado." 
                      />
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <RequirementItem 
                        icon={carOutline} 
                        title="Hoja de Vida del Conductor" 
                        description="Se obtiene en el Registro Civil." 
                      />
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <RequirementItem 
                        icon={schoolOutline} 
                        title="Certificado de Estudios (Minimo 8 Basico aprobado)" 
                        description="Original o copia legalizada." 
                      />
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <RequirementItem 
                        icon={documentTextOutline} 
                        title="Certificado de Antecedentes" 
                        description="Verificación legal." 
                      />
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <RequirementItem 
                        icon={homeOutline} 
                        title="Certificado de Domicilio o Comprobante de Residencia" 
                        description="Cuenta de servicios, Registro Social de Hogares, etc." 
                      />
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <RequirementItem 
                        icon={medicalOutline} 
                        title="Examenes Medicos (Sensometrico y Psicometrico)" 
                        description="Aprobacion obligatoria." 
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <div className="detalle-footer" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  {/* 🔌 El botón ahora rutea dinámicamente según el estado de la hora */}
                  <IonButton routerLink={urlSiguiente}>{textoBoton}</IonButton>
                </div>
              </>
            )}

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default DetalleTramite;