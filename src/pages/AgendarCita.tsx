import React, { useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import './AgendarCita.css';

function AgendarCita() {
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(17);

  const horasMañana = ['09:00', '09:30', '10:00', '10:30', '11:00'];
  const horasTarde = ['14:00', '14:30', '15:00', '15:30'];

  return (
    <IonPage>
      {/* Usamos el header que ya creamos, con el botón de volver automático */}
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
                      <IonButton fill="clear" color="dark"><chevronBackOutline /></IonButton>
                      <span className="month-name">Septiembre 2026</span>
                      <IonButton fill="clear" color="dark"><chevronForwardOutline /></IonButton>
                    </div>
                    
                    <div className="calendar-grid">
                      {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
                        <div key={d} className="weekday-label">{d}</div>
                      ))}
                      {[...Array(30)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = diaSeleccionado === day;
                        const isBlocked = day > 20; // Ejemplo de días sin cupo
                        
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
              <IonButton color="primary" className="btn-confirm" disabled={!horaSeleccionada}>
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