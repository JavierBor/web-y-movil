import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonLabel,
  IonToast,
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import {
  downloadOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import './GestionTramites.css';

// ─── Tipos ───────────────────────────────
type EstadoTramite = 'Confirmado' | 'Pendiente' | 'Rechazado';

interface Tramite {
  id: string;
  nombre: string;
  ref: string;
  fecha: string;
  estado: EstadoTramite;
  documentoUrl?: string;
}

// ─── Datos iniciales ─────────────────────
const tramitesIniciales: Tramite[] = [
  {
    id: '1',
    nombre: 'Solicitud de Pasaporte',
    ref: 'WEB-PAS-1122',
    fecha: '15/05/2024',
    estado: 'Confirmado',
    documentoUrl: '#',
  },
  {
    id: '2',
    nombre: 'Certificado de Cédula de Identidad',
    ref: 'WEB-CERT-9988',
    fecha: '10/05/2024',
    estado: 'Pendiente',
    documentoUrl: '#',
  },
  {
    id: '3',
    nombre: 'Solicitud de Bono Invierno',
    ref: 'WEB-BOND-5566',
    fecha: '01/05/2024',
    estado: 'Pendiente',
    documentoUrl: '#',
  },
  {
    id: '4',
    nombre: 'Renacionalización',
    ref: 'WEB-RE-3344',
    fecha: '15/04/2024',
    estado: 'Pendiente',
    documentoUrl: '#',
  },
];

const GestionTramites: React.FC = () => {
  const [tramites, setTramites] = useState<Tramite[]>(tramitesIniciales);
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

  // ── Llama a la API REST del backend ──
  const handleAccion = async (id: string, accion: 'Confirmar' | 'Rechazar') => {
    setLoadingId(id);
    try {
      // Reemplazar con: await fetch(`/api/tramites/${id}`, { method: 'PUT', ... })
      await new Promise((res) => setTimeout(res, 1200));

      const nuevoEstado: EstadoTramite =
        accion === 'Confirmar' ? 'Confirmado' : 'Rechazado';

      setTramites((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
      );

      setToast({
        isOpen: true,
        message:
          accion === 'Confirmar'
            ? 'Trámite confirmado exitosamente.'
            : 'Trámite rechazado correctamente.',
        color: accion === 'Confirmar' ? 'success' : 'warning',
      });
    } catch {
      setToast({
        isOpen: true,
        message: 'Error al procesar la acción. Intente nuevamente.',
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

  return (
    <IonPage className="gestion-page">
      {/* Header con modo Admin activado */}
      <CustomHeader defaultHref="/AdminMenu" isAdmin={true} />

      <IonContent className="gestion-content">
        <PageLayout>
          {/* Tarjeta principal con título */}
          <MainCard title="Gestión de Trámites Pendientes" maxWidth="960px">
            
            <div className="list-wrapper">
              {tramites.map((tramite) => (
                <div
                  key={tramite.id}
                  className={`tramite-card borde-${tramite.estado.toLowerCase()}`}
                >
                  {/* Col izquierda: info del trámite */}
                  <div className="col-info">
                    <p className="t-nombre">{tramite.nombre}</p>
                    <p className="t-ref">Ref: {tramite.ref}</p>
                    <p className="t-fecha">{tramite.fecha}</p>
                  </div>

                  {/* Col central: estado */}
                  <div className="col-estado">
                    <span className="estado-label">Estado:&nbsp;</span>
                    <span className={`estado-valor ${tramite.estado.toLowerCase()}`}>
                      {tramite.estado}
                    </span>
                  </div>

                  {/* Col derecha: acciones */}
                  <div className="col-acciones">
                    <a
                      href={tramite.documentoUrl ?? '#'}
                      className="link-descargar"
                      onClick={(e) => e.preventDefault()}
                    >
                      <IonIcon icon={downloadOutline} className="dl-icon" />
                      Descargar documentos subidos
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
                          Rechazar Cita
                        </IonButton>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {tramites.length === 0 && (
                <div className="empty-state">
                  <IonIcon icon={checkmarkCircleOutline} className="empty-icon" />
                  <p>No hay trámites pendientes.</p>
                </div>
              )}
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>

      {/* ── ALERT ── */}
      <IonAlert
        isOpen={alertConfig.isOpen}
        onDidDismiss={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        header={`${alertConfig.accion} trámite`}
        message={`¿Desea ${alertConfig.accion.toLowerCase()} el trámite "${alertConfig.nombre}"?`}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: alertConfig.accion,
            handler: () => handleAccion(alertConfig.tramiteId, alertConfig.accion),
          },
        ]}
      />

      {/* ── TOAST ── */}
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