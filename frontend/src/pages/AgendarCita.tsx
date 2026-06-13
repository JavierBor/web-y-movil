import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonText, IonIcon, useIonToast } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';   
import { useHistory } from 'react-router-dom'; 
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import API from '../services/api'; 
import './AgendarCita.css';

function AgendarCita() {
  const history = useHistory();
  const [present] = useIonToast();

  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(17);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado local para retener el ID de la solicitud en curso
  const [solicitudId, setSolicitudId] = useState<number | null>(null);

  const horasMañana = ['09:00', '09:30', '10:00', '10:30', '11:00'];
  const horasTarde = ['14:00', '14:30', '15:00', '15:30'];

  /**
   * CANDADO DE FLUJO: Captura el ID de la solicitud desde el localStorage
   * para evitar las pérdidas de estado por culpa del IonRouterOutlet de Ionic.
   */
  useEffect(() => {
    const idDeLaSolicitud = localStorage.getItem('solicitud_id_actual');

    if (!idDeLaSolicitud) {
      // Si el ciudadano intenta entrar directo a la URL de la agenda sin haber subido sus papeles,
      // lo devolvemos por seguridad para evitar registros huérfanos sin archivos.
      present({
        message: 'Acceso inválido: Debe completar el paso de documentos primero.',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      history.push('/subir-documentos');
      return;
    }

    setSolicitudId(Number(idDeLaSolicitud));
    setLoading(false);
  }, [history, present]);

  /**
   * Actualiza la solicitud existente inyectándole la fecha y hora elegidas
   */
  const handleConfirmCita = async () => {
    if (!horaSeleccionada || !solicitudId) return;

    const sesion = localStorage.getItem('usuario_conectado');
    if (!sesion) {
      alert('Error de sesión: Por favor, vuelve a iniciar sesión.');
      history.push('/Login');
      return;
    }

    const mesAño = "2026-09"; 
    const diaFormateado = diaSeleccionado.toString().padStart(2, '0');
    const fechaFinal = `${mesAño}-${diaFormateado}`; 
    const horaFinal = `${horaSeleccionada}:00`;     

    try {
      // Payload de actualización limpia para Sequelize en Express
      const payload = {
        fecha_cita: fechaFinal,
        hora_cita: horaFinal
      };

      console.log(`Enviando actualización de agenda para trámite ID ${solicitudId}:`, payload);

      // Invocamos el método PUT apuntando al ID específico del trámite en la URL
      const response = await API.put(`/tramites/${solicitudId}`, payload);

      if (response.data.ok) {
        // Limpiamos el ID temporal del almacenamiento local ya que el flujo finalizó con éxito
        localStorage.removeItem('solicitud_id_actual');

        present({
          message: '¡Cita agendada con éxito! Tu solicitud quedó en estado Pendiente para revisión de antecedentes.',
          duration: 3000,
          color: 'success',
          position: 'top'
        });
        history.push('/MenuPrincipal'); 
      }

    } catch (error: any) {
      console.error('Error al registrar la cita municipal:', error);
      alert(error.response?.data?.mensaje || 'Hubo un problema al procesar tu agenda. Intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <CustomHeader defaultHref="/subir-documentos" />
        <IonContent>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ color: '#666' }}>Cargando datos del asistente...</p>
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

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
}

export default AgendarCita;