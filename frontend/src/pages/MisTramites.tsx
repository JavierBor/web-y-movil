import React, { useState, useEffect } from 'react';
import CustomHeader from '../components/CustomHeader';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import {
  downloadOutline,
  calendarOutline,
  checkmarkCircle,
  closeCircle,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import API from '../services/api'; // 🔌 Instancia centralizada de Axios
import './MisTramites.css';

// ─── Tipos Originales Preservados ─────────────────────────
type PasoEstado = 'completado' | 'activo' | 'error' | 'pendiente';

interface Paso {
  label: string;
  estado: PasoEstado;
}

type AccionTramite = 'confirmar_cita' | 'descargar_comprobante' | 'espera' | 'falta_antecedentes';

interface Tramite {
  id: string;
  nombre: string;
  ref: string;
  fecha: string;
  pasos: Paso[];
  mensaje: string;
  accion: AccionTramite;
}

// ─── Sub-componente: Stepper ──────────────────────────────
const Stepper: React.FC<{ pasos: Paso[] }> = ({ pasos }) => {
  return (
    <div className="stepper">
      {pasos.map((paso, idx) => {
        const esUltimo = idx === pasos.length - 1;
        return (
          <React.Fragment key={idx}>
            <div className="step-node">
              <div className={`step-circle step-${paso.estado}`}>
                {paso.estado === 'completado' && (
                  <IonIcon icon={checkmarkCircle} className="step-icon completado" />
                )}
                {paso.estado === 'error' && (
                  <IonIcon icon={closeCircle} className="step-icon error" />
                )}
                {(paso.estado === 'activo' || paso.estado === 'pendiente') && (
                  <span className={`step-dot ${paso.estado}`} />
                )}
              </div>
              {paso.label && (
                <span className={`step-label step-label-${paso.estado}`}>
                  {paso.label.split('\n').map((line, i) => (
                    <span key={i} className="step-line">
                      {line}
                    </span>
                  ))}
                </span>
              )}
            </div>

            {!esUltimo && (
              <div
                className={`step-connector ${
                  pasos[idx + 1].estado !== 'pendiente' ||
                  paso.estado === 'completado'
                    ? 'connector-active'
                    : 'connector-inactive'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Componente Principal Conectado a Postgres ─────────────
const MisTramites: React.FC = () => {
  const history = useHistory();
  
  // Estado dinámico alimentado por la API
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loadingView, setLoadingView] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger' | 'medium';
  }>({ isOpen: false, message: '', color: 'success' });

  /**
   * 📡 EFECTO: Descarga el historial del usuario desde PostgreSQL
   */
  useEffect(() => {
    const cargarHistorialUsuario = async () => {
      const sesion = localStorage.getItem('usuario_conectado');
      if (!sesion) {
        history.push('/Login');
        return;
      }

      try {
        const usuario = JSON.parse(sesion);
        
        // Consumimos el endpoint GET /api/tramites/usuario/:usuario_id
        const response = await API.get(`/tramites/usuario/${usuario.id}`);
        const solicitudesDB = response.data.solicitudes || [];

        // MAPEO RELACIONAL: Convertimos filas de SQL a la estructura del Stepper
        const tramitesFormateados: Tramite[] = solicitudesDB.map((sol: any) => {
          
          // 1. Traducir tramite_id al nombre oficial de tu catálogo maestro
          let nombreTramite = 'Trámite Municipal General';
          if (sol.tramite_id === 1) nombreTramite = 'Permiso de Circulación';
          if (sol.tramite_id === 2) nombreTramite = 'Obtener/Renovar Licencia Clase B';
          if (sol.tramite_id === 3) nombreTramite = 'Derechos de Aseo Domiciliario';

          // 2. Formatear la fecha para remover la estampa ISO de Postgres
          const fechaLimpia = sol.fecha_cita ? sol.fecha_cita.split('T')[0] : 'Por definir';

          // 3. Estructuración inteligente del Stepper según el estado de la fila
          let pasosStepper: Paso[] = [];
          let mensajeEstado = '';
          let accionBoton: AccionTramite = 'espera';

          if (sol.estado_tramite === 'Pendiente') {
            pasosStepper = [
              { label: 'Ingresado', estado: 'completado' },
              { label: 'En Revisión', estado: 'activo' },
              { label: 'Aprobado', estado: 'pendiente' }
            ];
            mensajeEstado = sol.tramite_id === 2 
              ? 'Tus documentos están siendo validados. Pronto podrás confirmar tu examen.' 
              : 'Pago en proceso de validación por tesorería municipal.';
            accionBoton = 'espera';
          } 
          else if (sol.estado_tramite === 'Confirmada') {
            pasosStepper = [
              { label: 'Ingresado', estado: 'completado' },
              { label: 'En Revisión', estado: 'completado' },
              { label: 'Finalizado', estado: 'completado' }
            ];
            mensajeEstado = 'Trámite aprobado y resuelto con éxito.';
            accionBoton = 'descargar_comprobante';
          } 
          else {
            // Caso: Rechazado / Fallido
            pasosStepper = [
              { label: 'Ingresado', estado: 'completado' },
              { label: 'Revisión', estado: 'error' },
              { label: 'Rechazado', estado: 'error' }
            ];
            mensajeEstado = 'Solicitud rechazada. Antecedentes inconsistentes o impagos.';
            accionBoton = 'falta_antecedentes';
          }

          return {
            id: sol.id.toString(),
            nombre: nombreTramite,
            ref: `MUN-SD-${sol.id.toString().padStart(4, '0')}`, // Generamos código de referencia con el ID real
            fecha: fechaLimpia,
            pasos: pasosStepper,
            mensaje: mensajeEstado,
            accion: accionBoton,
            comprobanteUrl: sol.comprobante_url // Conservamos la ruta de descarga para el botón
          };
        });

        setTramites(tramitesFormateados);

      } catch (error) {
        console.error('Error al cargar historial municipal:', error);
        setToast({ isOpen: true, message: 'No se pudo conectar con el historial municipal.', color: 'danger' });
      } finally {
        setLoadingView(false);
      }
    };

    cargarHistorialUsuario();
  }, [history]);

  /**
   * ACCIÓN: Descargar comprobante oficial de la base de datos
   */
  const handleDescargar = async (tramite: Tramite) => {
    setLoadingId(tramite.id);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      
      // Rescatamos la ruta virtual que guardamos en Postgres
      const solEspecífica: any = tramite;
      if (solEspecífica.comprobanteUrl) {
        alert(`Descargando comprobante oficial de Santo Domingo desde: ${solEspecífica.comprobanteUrl}`);
      } else {
        alert('Descargando comprobante municipal estándar digital (PDF)...');
      }

      setToast({ isOpen: true, message: 'Documento descargado en su dispositivo.', color: 'success' });
    } catch {
      setToast({ isOpen: true, message: 'Error al emitir el archivo digital.', color: 'danger' });
    } finally {
      setLoadingId(null);
    }
  };

  if (loadingView) {
    return (
      <IonPage>
        <CustomHeader defaultHref="/MenuPrincipal" />
        <IonContent>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ color: '#666', marginTop: '15px' }}>Consultando registros en la Municipalidad...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="mis-tramites-page">
      <CustomHeader defaultHref="/MenuPrincipal" />

      <IonContent className="mt-content">
        <div className="mt-wrapper">
          <h1 className="mt-title">Mi Historial de Trámites</h1>

          {tramites.length === 0 ? (
            <div className="no-data-box" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No registras ninguna solicitud de trámite o pago histórico en la comuna de Santo Domingo.</p>
            </div>
          ) : (
            tramites.map((tramite) => (
              <div key={tramite.id} className="mt-card">
                
                {/* Columna izquierda: Info Real */}
                <div className="mt-col-info">
                  <p className="mt-nombre">{tramite.nombre}</p>
                  <p className="mt-ref">{tramite.ref}</p>
                  <p className="mt-fecha">Fecha: {tramite.fecha}</p>
                </div>

                {/* Columna central: Stepper Dinámico */}
                <div className="mt-col-stepper">
                  <Stepper pasos={tramite.pasos} />
                </div>

                {/* Columna derecha: Mensaje y Botones reactivos */}
                <div className="mt-col-accion">
                  <p className="mt-mensaje">{tramite.mensaje}</p>

                  {tramite.accion === 'descargar_comprobante' && (
                    <IonButton
                      className="mt-btn-primary"
                      size="small"
                      onClick={() => handleDescargar(tramite)}
                      disabled={loadingId === tramite.id}
                    >
                      {loadingId === tramite.id ? (
                        <IonSpinner name="crescent" className="mt-spinner" />
                      ) : (
                        <>
                          <IonIcon icon={downloadOutline} slot="start" />
                          Descargar Comprobante
                        </>
                      )}
                    </IonButton>
                  )}

                  {tramite.accion === 'falta_antecedentes' && (
                    <span style={{ color: 'var(--ion-color-danger)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      ⚠️ Revisión Rechazada
                    </span>
                  )}

                  {tramite.accion === 'espera' && (
                    <span style={{ color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      🕒 En proceso
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </IonContent>

      <IonToast
        isOpen={toast.isOpen}
        onDidDismiss={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        duration={3000}
        color={toast.color}
        position="top"
      />
    </IonPage>
  );
};

export default MisTramites;