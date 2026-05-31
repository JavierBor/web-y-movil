import React, { useState, useEffect } from 'react';
import CustomHeader from '../components/CustomHeader';  

import {
  IonPage,
  IonContent,
  IonIcon,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import {
  alertCircle,
  calendarOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import API from '../services/api'; 
import './MisNotificaciones.css';

interface Notificacion {
  id: string;
  tipo: 'urgente' | 'cita' | 'aprobado' | 'mensaje';
  titulo: string;
  ref: string;
  fecha: string;
  mensaje: string;
}

const MisNotificaciones: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true);
  const [toast, setToast] = useState({ isOpen: false, message: '', color: 'success' as 'success' | 'danger' });

  useEffect(() => {
    const sincronizarAlertasComunales = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const usuarioSesion = localStorage.getItem('usuario_conectado'); 
        const usuario = usuarioSesion ? JSON.parse(usuarioSesion) : null;

        if (!token || !usuario || !usuario.id) {
          setLoadingScreen(false);
          return;
        }
        
        // Conexión transaccional directa a tu endpoint real
        const response = await API.get(`/tramites/usuario/${usuario.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.ok) {
          
          // Filtramos el buzón activo (Pendientes o Rechazados) para control UX
          const solicitudesActivas = response.data.solicitudes.filter(
            (sol: any) => sol.estado_tramite === 'Pendiente' || sol.estado_tramite === 'Rechazada' || sol.estado_tramite === 'Rechazado'
          );

          const mapeoDinamico = solicitudesActivas.map((sol: any) => {
            const nombreTramite = sol.Tramite?.nombre_tramite || 'Trámite Municipal';
            let tipoCard: 'urgente' | 'cita' | 'aprobado' | 'mensaje' = 'mensaje';
            let mensajeUI = '';

            if (sol.estado_tramite === 'Pendiente') {
              tipoCard = 'cita';
              mensajeUI = `Tu solicitud de ${nombreTramite} fue ingresada con éxito en el sistema. Actualmente se encuentra esperando revisión por parte del departamento encargado en el Edificio Consistorial.`;
            } 
            else if (sol.estado_tramite === 'Rechazada' || sol.estado_tramite === 'Rechazado') {
              tipoCard = 'urgente';
              mensajeUI = `Atención: Tu trámite de ${nombreTramite} presenta observaciones en los antecedentes provistos. Por favor, comuníquese a la brevedad con Soporte Municipal llamando al fono +56 35 220 0000 o acérquese de forma presencial.`;
            }

            return {
              id: sol.id.toString(),
              tipo: tipoCard,
              titulo: nombreTramite,
              ref: `MUN-SD-${sol.id.toString().padStart(4, '0')}`,
              fecha: new Date(sol.createdAt).toLocaleDateString('es-CL'),
              mensaje: mensajeUI
            };
          });

          setNotificaciones(mapeoDinamico);
        }
      } catch (error) {
        console.error('Error al sincronizar notificaciones:', error);
        setToast({ isOpen: true, message: 'Error al sincronizar el buzón de alertas.', color: 'danger' });
      } finally {
        setLoadingScreen(false);
      }
    };

    sincronizarAlertasComunales();
  }, []);

  return (
    <IonPage className="notif-page">
      <CustomHeader showBackButton={true} defaultHref="/MenuPrincipal" />

      <IonContent className="notif-content">
        <div className="notif-wrapper">
          <h1 className="notif-title">Mis Notificaciones Pendientes</h1>

          {loadingScreen ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <IonSpinner name="crescent" />
              <p style={{ color: '#666', marginTop: '10px' }}>Conectando de forma segura con la base de datos...</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#777' }}>
              <p>Tu buzón municipal está limpio. No registras alertas o trámites pendientes.</p>
            </div>
          ) : (
            notificaciones.map((notif) => (
              <div key={notif.id} className={`notif-card tipo-${notif.tipo}`}>
                
                {/* 🏢 Col Izquierda: Identificación e ID Relacional de PostgreSQL */}
                <div className="notif-col-info">
                  <p className="notif-nombre">{notif.titulo}</p>
                  <p className="notif-ref">{notif.ref}</p>
                  <p className="notif-fecha">Fecha: {notif.fecha}</p>
                </div>

                {/* 🔔 Col Central: Iconografía de Alerta Dinámica */}
                <div className="notif-col-icono">
                  {notif.tipo === 'urgente' && <IonIcon icon={alertCircle} className="icono-urgente" style={{fontSize: '40px', color: 'var(--ion-color-danger)'}} />}
                  {notif.tipo === 'cita' && <IonIcon icon={calendarOutline} className="icono-cita" style={{fontSize: '40px', color: 'var(--ion-color-primary)'}} />}
                  {notif.tipo === 'aprobado' && <IonIcon icon={checkmarkCircle} className="icono-aprobado" style={{fontSize: '40px', color: 'var(--ion-color-success)'}} />}
                </div>

                {/* 📝 Col Derecha: Texto Informativo Completo (Ocupa todo el ancho restante) */}
                <div className="notif-col-accion" style={{ flex: 2, paddingLeft: '15px' }}>
                  <p className="notif-mensaje" style={{ margin: 0, lineHeight: '1.4', color: '#444' }}>
                    {notif.mensaje}
                  </p>
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

export default MisNotificaciones;