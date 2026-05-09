import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  personCircleOutline,
  chevronDownOutline,
  downloadOutline,
  calendarOutline,
  checkmarkCircle,
  closeCircle,
  ellipseOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './MisTramites.css';

// ─── Tipos ───────────────────────────────────────────────
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

// ─── Datos de ejemplo ─────────────────────────────────────
const tramitesIniciales: Tramite[] = [
  {
    id: '1',
    nombre: 'Solicitud de Pasaporte',
    ref: 'WEB-PAS-1122',
    fecha: '15/05/2024',
    pasos: [
      { label: 'Recibido', estado: 'completado' },
      { label: 'En Revisión', estado: 'activo' },
      { label: 'Acción\nRequerida', estado: 'activo' },
      { label: 'Aprobado', estado: 'pendiente' },
    ],
    mensaje: 'Debe confirmar su cita presencial.',
    accion: 'confirmar_cita',
  },
  {
    id: '2',
    nombre: 'Certificado de Cédula de Identidad',
    ref: 'WEB-CERT-9988',
    fecha: '10/05/2024',
    pasos: [
      { label: 'Recibido', estado: 'completado' },
      { label: 'En Revisión', estado: 'completado' },
      { label: 'Aprobado', estado: 'completado' },
    ],
    mensaje: 'Aprobación exitosa. Pago en proceso.',
    accion: 'descargar_comprobante',
  },
  {
    id: '3',
    nombre: 'Solicitud de Bono Invierno',
    ref: 'WEB-BOND-5566',
    fecha: '01/05/2024',
    pasos: [
      { label: 'Recibido', estado: 'activo' },
      { label: '', estado: 'pendiente' },
      { label: 'Aprobado', estado: 'pendiente' },
    ],
    mensaje: 'En espera de validación.',
    accion: 'espera',
  },
  {
    id: '4',
    nombre: 'Renacionalización',
    ref: 'WEB-RE-3344',
    fecha: '15/04/2024',
    pasos: [
      { label: 'Recibido', estado: 'completado' },
      { label: '', estado: 'pendiente' },
      { label: 'Falta de\nantecedentes.', estado: 'error' },
    ],
    mensaje: 'Falta de antecedentes.',
    accion: 'falta_antecedentes',
  },
];

// ─── Sub-componente: Stepper ──────────────────────────────
const Stepper: React.FC<{ pasos: Paso[] }> = ({ pasos }) => {
  return (
    <div className="stepper">
      {pasos.map((paso, idx) => {
        const esUltimo = idx === pasos.length - 1;
        return (
          <React.Fragment key={idx}>
            {/* Nodo */}
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

            {/* Línea conectora */}
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

// ─── Componente principal ─────────────────────────────────
const MisTramites: React.FC = () => {
  const history = useHistory();
  const [tramites] = useState<Tramite[]>(tramitesIniciales);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger' | 'medium';
  }>({ isOpen: false, message: '', color: 'success' });

  const handleConfirmarCita = async (id: string) => {
    setLoadingId(id);
    try {
      // Reemplazar con: await fetch(`/api/tramites/${id}/confirmar-cita`, { method: 'POST', ... })
      await new Promise((res) => setTimeout(res, 1300));
      setToast({ isOpen: true, message: 'Cita confirmada exitosamente.', color: 'success' });
    } catch {
      setToast({ isOpen: true, message: 'Error al confirmar la cita.', color: 'danger' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDescargar = async (id: string) => {
    setLoadingId(id);
    try {
      await new Promise((res) => setTimeout(res, 900));
      setToast({ isOpen: true, message: 'Comprobante descargado.', color: 'success' });
    } catch {
      setToast({ isOpen: true, message: 'Error al descargar el comprobante.', color: 'danger' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <IonPage className="mis-tramites-page">

      {/* ── HEADER ── */}
      <IonHeader className="mt-header ion-no-border">
        <IonToolbar className="mt-toolbar">
          <IonButtons slot="start">
            <IonButton className="mt-back-btn" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              <IonLabel>Volver</IonLabel>
            </IonButton>
          </IonButtons>

          <div className="mt-logo-wrap" slot="start">
            <img
              src="/assets/logo-municipalidad.png"
              alt="Logo Municipalidad"
              className="mt-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <IonButtons slot="end">
            <IonButton className="mt-account-btn">
              <IonIcon icon={personCircleOutline} className="mt-account-icon" />
              <span className="mt-account-label">Mi Cuenta</span>
              <IonIcon icon={chevronDownOutline} className="mt-chevron" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* ── CONTENT ── */}
      <IonContent className="mt-content">
        <div className="mt-wrapper">

          <h1 className="mt-title">Mis Trámites Pendientes</h1>

          {tramites.map((tramite) => (
            <div key={tramite.id} className="mt-card">

              {/* Columna izquierda: info */}
              <div className="mt-col-info">
                <p className="mt-nombre">{tramite.nombre}</p>
                <p className="mt-ref">Ref: {tramite.ref}</p>
                <p className="mt-fecha">{tramite.fecha}</p>
              </div>

              {/* Columna central: stepper */}
              <div className="mt-col-stepper">
                <Stepper pasos={tramite.pasos} />
              </div>

              {/* Columna derecha: mensaje + acción */}
              <div className="mt-col-accion">
                <p className="mt-mensaje">{tramite.mensaje}</p>

                {tramite.accion === 'confirmar_cita' && (
                  <IonButton
                    className="mt-btn-primary"
                    size="small"
                    onClick={() => handleConfirmarCita(tramite.id)}
                    disabled={loadingId === tramite.id}
                  >
                    {loadingId === tramite.id ? (
                      <IonSpinner name="crescent" className="mt-spinner" />
                    ) : (
                      <>
                        <IonIcon icon={calendarOutline} slot="start" />
                        Confirmar Cita
                      </>
                    )}
                  </IonButton>
                )}

                {tramite.accion === 'descargar_comprobante' && (
                  <IonButton
                    className="mt-btn-primary"
                    size="small"
                    onClick={() => handleDescargar(tramite.id)}
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
              </div>

            </div>
          ))}

        </div>
      </IonContent>

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

export default MisTramites;
