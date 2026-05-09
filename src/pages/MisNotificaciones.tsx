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
  IonBadge,
} from '@ionic/react';
import {
  arrowBackOutline,
  personCircleOutline,
  chevronDownOutline,
  alertCircle,
  calendarOutline,
  checkmarkCircle,
  chatbubbleOutline,
  cloudUploadOutline,
  downloadOutline,
  eyeOutline,
  mailOpenOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './MisNotificaciones.css';

// ─── Tipos ────────────────────────────────────────────────
type TipoNotificacion = 'urgente' | 'cita' | 'aprobado' | 'mensaje';
type AccionNotificacion = 'subir_documento' | 'ver_detalles' | 'descargar_comprobante' | 'ver_mensaje';

interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  ref: string;
  fecha: string;
  mensaje: string;
  accion: AccionNotificacion;
  // Urgente
  fechaLimite?: string;
  diasRestantes?: number;
  progresoPorcentaje?: number;
  // Cita
  fechaCita?: string;
  // Leído
  leido?: boolean;
}

// ─── Datos de ejemplo ─────────────────────────────────────
const notificacionesIniciales: Notificacion[] = [
  {
    id: '1',
    tipo: 'urgente',
    titulo: 'Urgente: Requerimiento de Documentación',
    ref: 'WEB-DOC-0051',
    fecha: '20/05/2024',
    mensaje: 'Falta certificado de antecedentes penales.',
    accion: 'subir_documento',
    fechaLimite: '25/05/2024',
    diasRestantes: 5,
    progresoPorcentaje: 70,
  },
  {
    id: '2',
    tipo: 'cita',
    titulo: 'Aviso: Confirmación de Cita',
    ref: 'WEB-CITA-1234',
    fecha: '18/05/2024',
    mensaje: 'Por favor confirme su asistencia.',
    accion: 'ver_detalles',
    fechaCita: '22/05/2024 a las 10:00 AM',
  },
  {
    id: '3',
    tipo: 'aprobado',
    titulo: 'Actualización de Estado: Trámite Aprobado',
    ref: 'WEB-CERT-9988',
    fecha: '17/05/2024',
    mensaje: 'Su documento está listo para descarga.',
    accion: 'descargar_comprobante',
  },
  {
    id: '4',
    tipo: 'mensaje',
    titulo: 'Mensaje General: Nuevo Beneficio Disponible',
    ref: 'Gral.Invierno',
    fecha: '15/05/2024',
    mensaje: 'Postulaciones abiertas para el Bono Invierno 2024.',
    accion: 'ver_mensaje',
    leido: false,
  },
];

// ─── Ícono central según tipo ────────────────────────────
const IconoCentral: React.FC<{ notif: Notificacion }> = ({ notif }) => {
  switch (notif.tipo) {
    case 'urgente':
      return (
        <div className="icono-urgente-wrap">
          <IonIcon icon={alertCircle} className="icono-urgente" />
          <div className="barra-progreso-wrap">
            <div
              className="barra-progreso-fill"
              style={{ width: `${notif.progresoPorcentaje ?? 0}%` }}
            />
          </div>
          <p className="urgente-fecha-limite">
            Fecha Límite: {notif.fechaLimite}
          </p>
          <p className="urgente-dias">({notif.diasRestantes} días restantes)</p>
        </div>
      );
    case 'cita':
      return (
        <div className="icono-cita-wrap">
          <IonIcon icon={calendarOutline} className="icono-cita" />
          <p className="cita-info">Cita: {notif.fechaCita}</p>
        </div>
      );
    case 'aprobado':
      return (
        <div className="icono-aprobado-wrap">
          <IonIcon icon={checkmarkCircle} className="icono-aprobado" />
          <p className="aprobado-label">Aprobado</p>
        </div>
      );
    case 'mensaje':
      return (
        <div className="icono-mensaje-wrap">
          <IonIcon icon={chatbubbleOutline} className="icono-mensaje" />
          <p className="mensaje-estado">{notif.leido ? 'Leído' : 'No Leído'}</p>
        </div>
      );
  }
};

// ─── Componente principal ─────────────────────────────────
const MisNotificaciones: React.FC = () => {
  const history = useHistory();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesIniciales);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger' | 'medium';
  }>({ isOpen: false, message: '', color: 'success' });

  const ejecutarAccion = async (notif: Notificacion) => {
    setLoadingId(notif.id);

    // Marcar como leído si es mensaje
    if (notif.tipo === 'mensaje') {
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, leido: true } : n))
      );
    }

    try {
      // Reemplazar con la llamada real a la API
      await new Promise((res) => setTimeout(res, 1100));

      const mensajes: Record<AccionNotificacion, string> = {
        subir_documento: 'Redirigiendo para subir documento...',
        ver_detalles: 'Cargando detalles de la cita...',
        descargar_comprobante: 'Comprobante descargado exitosamente.',
        ver_mensaje: 'Abriendo mensaje...',
      };

      setToast({ isOpen: true, message: mensajes[notif.accion], color: 'success' });
    } catch {
      setToast({ isOpen: true, message: 'Error al procesar la acción.', color: 'danger' });
    } finally {
      setLoadingId(null);
    }
  };

  const getLabelAccion = (accion: AccionNotificacion): string => {
    const labels: Record<AccionNotificacion, string> = {
      subir_documento: 'Subir Documento',
      ver_detalles: 'Ver Detalles',
      descargar_comprobante: 'Descargar Comprobante',
      ver_mensaje: 'Ver Mensaje',
    };
    return labels[accion];
  };

  const getIconoAccion = (accion: AccionNotificacion) => {
    const iconos: Record<AccionNotificacion, string> = {
      subir_documento: cloudUploadOutline,
      ver_detalles: eyeOutline,
      descargar_comprobante: downloadOutline,
      ver_mensaje: mailOpenOutline,
    };
    return iconos[accion];
  };

  return (
    <IonPage className="notif-page">

      {/* ── HEADER ── */}
      <IonHeader className="notif-header ion-no-border">
        <IonToolbar className="notif-toolbar">
          <IonButtons slot="start">
            <IonButton className="notif-back-btn" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              <IonLabel>Volver</IonLabel>
            </IonButton>
          </IonButtons>

          <div className="notif-logo-wrap" slot="start">
            <img
              src="/assets/logo-municipalidad.png"
              alt="Logo Municipalidad"
              className="notif-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <IonButtons slot="end">
            <IonButton className="notif-account-btn">
              <IonIcon icon={personCircleOutline} className="notif-account-icon" />
              <span className="notif-account-label">Mi Cuenta</span>
              <IonIcon icon={chevronDownOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* ── CONTENT ── */}
      <IonContent className="notif-content">
        <div className="notif-wrapper">

          <h1 className="notif-title">Mis Notificaciones Pendientes</h1>

          {notificaciones.map((notif) => (
            <div key={notif.id} className={`notif-card tipo-${notif.tipo}`}>

              {/* Col izquierda: info */}
              <div className="notif-col-info">
                <p className="notif-nombre">{notif.titulo}</p>
                <p className="notif-ref">Ref: {notif.ref}</p>
                <p className="notif-fecha">Fecha: {notif.fecha}</p>
              </div>

              {/* Col central: ícono dinámico */}
              <div className="notif-col-icono">
                <IconoCentral notif={notif} />
              </div>

              {/* Col derecha: mensaje + botón */}
              <div className="notif-col-accion">
                <p className="notif-mensaje">{notif.mensaje}</p>
                <IonButton
                  className="notif-btn"
                  size="small"
                  onClick={() => ejecutarAccion(notif)}
                  disabled={loadingId === notif.id}
                >
                  {loadingId === notif.id ? (
                    <IonSpinner name="crescent" className="notif-spinner" />
                  ) : (
                    <>
                      <IonIcon icon={getIconoAccion(notif.accion)} slot="start" />
                      {getLabelAccion(notif.accion)}
                    </>
                  )}
                </IonButton>
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

export default MisNotificaciones;
