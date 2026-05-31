import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonText, IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';   
import { useHistory } from 'react-router-dom'; 
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import API from '../services/api'; 
import './AgendarCita.css';

function AgendarCita() {
  const history = useHistory();
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(17);
  
  // Estados de control para la regla de negocio (un agendamiento a la vez)
  const [isBloqueado, setIsBloqueado] = useState<boolean>(false);
  const [mensajeBloqueo, setMensajeBloqueo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const horasMañana = ['09:00', '09:30', '10:00', '10:30', '11:00'];
  const horasTarde = ['14:00', '14:30', '15:00', '15:30'];

  /**
   * 🛡️ Valida restricciones en la base de datos antes de renderizar
   */
  useEffect(() => {
    const verificarHistorialActivo = async () => {
      const sesion = localStorage.getItem('usuario_conectado');
      if (!sesion) {
        setLoading(false);
        return;
      }
      
      try {
        const usuario = JSON.parse(sesion);
        const response = await API.get(`/tramites/usuario/${usuario.id}`);
        const solicitudesUser = response.data.solicitudes || [];
        
        console.log("Datos devueltos por el backend:", solicitudesUser);

        // Filtramos para que valide únicamente si ya existe un trámite de Licencia (tramite_id === 2) pendiente
      const tieneCitaActiva = solicitudesUser.some((solicitud: any) => {
  // Aseguramos la existencia del campo y comparamos de forma segura en minúsculas
  const estado = solicitud.estado_tramite?.toLowerCase() || solicitud.estado?.toLowerCase() || '';
  return solicitud.tramite_id === 2 && (estado === 'pendiente' || estado === 'en espera');
});

        if (tieneCitaActiva === true) {
          setIsBloqueado(true);
          setMensajeBloqueo(
            "Ya cuentas con una solicitud de licencia de conducir activa en el sistema. No se permite agendar múltiples citas simultáneas para este trámite hasta que la actual sea finalizada o rechazada por la administración municipal."
          );
        } else if (tieneCitaActiva === false) {
          setIsBloqueado(false);
        }
      } catch (error) {
        console.error('Error al validar restricciones de agenda:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarHistorialActivo();
  }, []);

  /**
   * 🚀 Envía la solicitud transaccional a PostgreSQL con soporte JSONB
   */
  const handleConfirmCita = async () => {
    if (!horaSeleccionada || isBloqueado) return;

    const sesion = localStorage.getItem('usuario_conectado');
    if (!sesion) {
      alert('Error de sesión: Por favor, vuelve a iniciar sesión.');
      history.push('/Login');
      return;
    }
    const usuario = JSON.parse(sesion);

    const mesAño = "2026-09"; 
    const diaFormateado = diaSeleccionado.toString().padStart(2, '0');
    const fechaFinal = `${mesAño}-${diaFormateado}`; 
    const horaFinal = `${horaSeleccionada}:00`;     

    try {
      // Payload transaccional estructurado adaptado al modelo JSONB
      const payload = {
        documentos_url: "/uploads/documentos/licencia_clase_b.pdf", 
        fecha_cita: fechaFinal,
        hora_cita: horaFinal,
        comprobante_url: null,
        usuario_id: usuario.id, 
        sucursal_id: 1,                    // ID 1: Edificio Consistorial Av. Sta Teresa
        tramite_id: 2,                     // ID 2: Obtener/Renovar Licencia en tu catálogo
        tipo_tramite: 'licencia',          // Guardamos el tipo de trámite real
        datos_extra: {                     // Inicializamos el objeto JSONB comodín
          clase: 'B'
        } 
      };

      console.log('Despachando reserva de hora para Licencia:', payload);

      const response = await API.post('/tramites', payload);

      if (response.status === 201 || response.data.ok) {
        alert('¡Cita agendada con éxito! Tu solicitud quedó en estado Pendiente para revisión de antecedentes.');
        history.push('/MenuPrincipal'); 
      }

    } catch (error: any) {
      console.error('Error al registrar la cita municipal:', error);
      alert(error.message || 'Hubo un problema al procesar tu agenda. Intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <CustomHeader defaultHref="/subir-documentos" />
        <IonContent>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ color: '#666' }}>Verificando disponibilidad de agenda...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <CustomHeader defaultHref="/subir-documentos" />
      
      <IonContent>
        <PageLayout>
          <MainCard title="Seleccionar Fecha y Hora" maxWidth="1000px">
            
            {isBloqueado ? (
              <div className="bloqueo-container" style={{ padding: '20px', textAlign: 'center' }}>
                <IonText color="danger">
                  <h3 style={{ fontWeight: 'bold', marginBottom: '15px' }}>⚠️ Restricción de Agendamiento</h3>
                  <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.6' }}>{mensajeBloqueo}</p>
                </IonText>
                <IonButton color="medium" style={{ marginTop: '25px' }} routerLink="/MenuPrincipal">
                  Volver al Menú Principal
                </IonButton>
              </div>
            ) : (
              <IonGrid className="ion-no-padding">
                <IonRow>
                  {/* COLUMNA CALENDARIO */}
                  <IonCol size="12" sizeLg="7" className="calendar-col">
                    <div className="calendar-wrapper">
                      <div className="calendar-nav">
                        <IonButton fill="clear" color="dark">
                          <IonIcon icon={chevronBackOutline} />
                        </IonButton>
                        <span className="month-name">Septiembre 2026</span>
                        <IonButton fill="clear" color="dark">
                          <IonIcon icon={chevronForwardOutline} />
                        </IonButton>
                      </div>
                      
                      <div className="calendar-grid">
                        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
                          <div key={d} className="weekday-label">{d}</div>
                        ))}
                        {[...Array(30)].map((_, i) => {
                          const day = i + 1;
                          const isSelected = diaSeleccionado === day;
                          const isBlocked = day > 20;
                          
                          return (
                            <div 
                              key={day} 
                              className={`day-cell ${isSelected ? 'active' : ''} ${isBlocked ? 'blocked' : ''}`}
                              onClick={() => !isBlocked && setDiaSeleccionado(day)}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </IonCol>

                  {/* COLUMNA HORARIOS */}
                  <IonCol size="12" sizeLg="5" className="times-col">
                    <div className="times-wrapper">
                      <h3 className="section-subtitle">Horarios Disponibles</h3>
                      
                      <p className="time-group-label">Mañana</p>
                      <div className="time-slots">
                        {horasMañana.map(h => (
                          <button 
                            key={h} 
                            className={`time-btn ${horaSeleccionada === h ? 'selected' : ''}`}
                            onClick={() => setHoraSeleccionada(h)}
                          >
                            {h}
                          </button>
                        ))}
                      </div>

                      <p className="time-group-label" style={{marginTop: '20px'}}>Tarde</p>
                      <div className="time-slots">
                        {horasTarde.map(h => (
                          <button 
                            key={h} 
                            className={`time-btn ${horaSeleccionada === h ? 'selected' : ''}`}
                            onClick={() => setHoraSeleccionada(h)}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}

            {!isBloqueado && (
              <div className="calendar-footer">
                <IonButton 
                  color="primary" 
                  className="btn-confirm" 
                  disabled={!horaSeleccionada}
                  onClick={handleConfirmCita}
                >
                  Confirmar Cita
                </IonButton>
              </div>
            )}

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
}

export default AgendarCita;