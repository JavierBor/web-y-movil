import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import {
  downloadOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import API from '../services/api'; 
import './GestionTramites.css';

type EstadoTramite = 'Confirmado' | 'Pendiente' | 'Rechazado';

interface Tramite {
  id: string;
  nombre: string;
  ref: string;
  fecha: string;
  estado: EstadoTramite;
  documentoUrl?: string;
  rutUsuario: string;   
}

const GestionTramites: React.FC = () => {
  const history = useHistory();
  
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loadingView, setLoadingView] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    tramiteId: string;
    accion: 'Confirmar' | 'Rechazar';
    nombre: string;
  }>({ isOpen: false, tramiteId: '', accion: 'Confirmar', nombre: '' });
  
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger' | 'warning';
  }>({ isOpen: false, message: '', color: 'success' });

  /**
   * 📡 GATILLO DE ENTRADA: Descarga el listado global de solicitudes desde Express
   */
  const cargarSolicitudesMunicipales = async () => {
    try {
      const response = await API.get('/tramites');
      const listaDB = response.data.solicitudes || [];

      // 🔄 MAPEO DINÁMICO: Soportando la expansión del catálogo de Plaza Cabildo
      const mappedTramites: Tramite[] = listaDB.map((sol: any) => {
        
        // 🚀 MEJORA: Prioriza el nombre dinámico del JOIN de Sequelize. Si no viene, evalúa los 5 casos.
        let nombreOficial = sol.Tramite?.nombre_tramite;

        if (!nombreOficial) {
          if (sol.tramite_id === 1) nombreOficial = 'Permiso de Circulación';
          else if (sol.tramite_id === 2) nombreOficial = 'Obtener/Renovar Licencia Clase B';
          else if (sol.tramite_id === 3) nombreOficial = 'Derechos de Aseo Domiciliario';
          else if (sol.tramite_id === 4) nombreOficial = 'Patente Municipal'; // 🏢 Mapeado con éxito
          else if (sol.tramite_id === 5) nombreOficial = 'Beca Municipal';    // 🎓 Mapeado con éxito
          else nombreOficial = 'Trámite Interno Comunal';
        }

        // Homologamos el género gramatical de los estados para no romper el CSS frontend
        let estadoUI: EstadoTramite = 'Pendiente';
        if (sol.estado_tramite === 'Confirmada' || sol.estado_tramite === 'Confirmado') estadoUI = 'Confirmado';
        if (sol.estado_tramite === 'Rechazada' || sol.estado_tramite === 'Rechazado') estadoUI = 'Rechazado';

        // Limpiamos la cadena ISO de la fecha de Postgres
        const fechaFormateada = sol.fecha_cita ? sol.fecha_cita.split('T')[0] : 'Por definir';

        // Extrae el RUT real obtenido mediante el include/JOIN relacional del backend
        const rutCiudadano = sol.Usuario?.rut || sol.usuario_rut || sol.rut || 'No disponible';

        return {
          id: sol.id.toString(),
          nombre: nombreOficial,
          ref: `MUN-SD-${sol.id.toString().padStart(4, '0')}`,
          fecha: fechaFormateada,
          estado: estadoUI,
          documentoUrl: sol.documentos_url,
          rutUsuario: rutCiudadano
        };
      });

      setTramites(mappedTramites);

    } catch (error) {
      console.error('Error al poblar panel de control administrativo:', error);
      setToast({
        isOpen: true,
        message: 'Error de comunicación: No se pudo obtener el catálogo de solicitudes.',
        color: 'danger'
      });
    } finally {
      setLoadingView(false);
    }
  };

  useEffect(() => {
    cargarSolicitudesMunicipales();
  }, []);

  const handleAccion = async (id: string, accion: 'Confirmar' | 'Rechazar') => {
    setLoadingId(id);
    const estadoBackend = accion === 'Confirmar' ? 'Confirmada' : 'Rechazada';

    try {
      await API.put(`/tramites/${id}`, {
        estado_tramite: estadoBackend
      });

      const nuevoEstadoUI: EstadoTramite = accion === 'Confirmar' ? 'Confirmado' : 'Rechazado';
      setTramites((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstadoUI } : t))
      );

      setToast({
        isOpen: true,
        message: accion === 'Confirmar'
          ? 'La solicitud municipal ha sido confirmada con éxito.'
          : 'La solicitud ha sido rechazada. Notificación despachada al vecino.',
        color: accion === 'Confirmar' ? 'success' : 'warning',
      });
    } catch (error) {
      console.error('Error al mutar el estado en Postgres:', error);
      setToast({
        isOpen: true,
        message: 'No se pudo actualizar el estado de la solicitud en el servidor.',
        color: 'danger',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const abrirAlerta = (tramite: Tramite, accion: 'Confirmar' | 'Rechazar') => {
    setAlertConfig({
      isOpen: true,
      tramiteId: tramite.id,
      accion,
      nombre: tramite.nombre,
    });
  };

  if (loadingView) {
    return (
      <IonPage>
        <CustomHeader defaultHref="/AdminMenu" isAdmin={true} />
        <IonContent>
          <div style={{ textAlign: 'center', marginTop: '70px' }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ color: '#555', marginTop: '15px' }}>Conectando al servidor centralizado...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="gestion-page">
      <CustomHeader defaultHref="/AdminMenu" isAdmin={true} />

      <IonContent className="gestion-content">
        <PageLayout>
          <MainCard title="Gestión de Trámites Pendientes" maxWidth="960px">
            
            <div className="list-wrapper">
              {tramites.map((tramite) => (
                <div
                  key={tramite.id}
                  className={`tramite-card borde-${tramite.estado.toLowerCase()}`}
                >
                  <div className="col-info">
                    <p className="t-nombre">{tramite.nombre}</p>
                    <p className="t-ref">{tramite.ref}</p>
                    <p className="t-rut" style={{ margin: '4px 0', fontSize: '0.95rem', color: '#1a3a5f', fontWeight: 'bold' }}>
                      RUT Ciudadano: {tramite.rutUsuario}
                    </p>
                    <p className="t-fecha">Agendado: {tramite.fecha}</p>
                  </div>

                  <div className="col-estado">
                    <span className="estado-label">Estado:&nbsp;</span>
                    <span className={`estado-valor ${tramite.estado.toLowerCase()}`}>
                      {tramite.estado}
                    </span>
                  </div>

                  <div className="col-acciones">
                    <a
                      href="#"
                      className="link-descargar"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!tramite.documentoUrl || tramite.documentoUrl === '#') {
                          alert('Este trámite fue un pago directo electrónico. No requiere validación de archivos adjuntos.');
                        } else {
                          alert(`Gatillando descarga del expediente digital cargado por el ciudadano desde la ruta: ${tramite.documentoUrl}`);
                        }
                      }}
                    >
                      <IonIcon icon={downloadOutline} className="dl-icon" />
                      Auditar documentos adjuntos
                    </a>

                    {tramite.estado === 'Pendiente' && (
                      <div className="btn-group">
                        <IonButton
                          className="btn-confirmar"
                          size="small"
                          onClick={() => abrirAlerta(tramite, 'Confirmar')}
                          disabled={loadingId === tramite.id}
                        >
                          {loadingId === tramite.id ? (
                            <IonSpinner name="crescent" className="mini-spinner" />
                          ) : (
                            'Confirmar Cita'
                          )}
                        </IonButton>

                        <IonButton
                          className="btn-rechazar"
                          size="small"
                          onClick={() => abrirAlerta(tramite, 'Rechazar')}
                          disabled={loadingId === tramite.id}
                        >
                          Rechazar
                        </IonButton>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {tramites.length === 0 && (
                <div className="empty-state">
                  <IonIcon icon={checkmarkCircleOutline} className="empty-icon" />
                  <p>Felicidades: No quedan solicitudes pendientes en la Municipalidad.</p>
                </div>
              )}
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>

      <IonAlert
        isOpen={alertConfig.isOpen}
        onDidDismiss={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        header={`${alertConfig.accion} solicitud`}
        message={`¿Confirma que desea pasar a estado ${alertConfig.accion === 'Confirmar' ? 'Aprobado' : 'Rechazado'} la solicitud "${alertConfig.nombre}"?`}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: alertConfig.accion,
            handler: () => handleAccion(alertConfig.tramiteId, alertConfig.accion),
          },
        ]}
      />

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

export default GestionTramites;