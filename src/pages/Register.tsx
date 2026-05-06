import React, { useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonLabel } from '@ionic/react';
import { carOutline, documentTextOutline, trashOutline, businessOutline, schoolOutline } from 'ionicons/icons';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import ProcedureCard from '../components/ProcedureCard';
import MainCard from '../components/MainCard'; // Importamos tu nuevo contenedor global
import './Tramites.css';

const Tramites: React.FC = () => {
  const [sucursal, setSucursal] = useState('Valparaiso');

  const listaTramites = [
    { title: "Permiso de circulación", icon: carOutline, desc: "Impuesto anual para el tránsito legal de vehículos" },
    { title: "Obtener/Renovar Licencia", icon: documentTextOutline, desc: "Documento oficial que autoriza legalmente a conducir" },
    { title: "Derechos de aseo", icon: trashOutline, desc: "Pago anual por el servicio de retiro de basura" },
    { title: "Patentes Municipales", icon: businessOutline, desc: "Permiso legal para ejercer actividades comerciales" },
    { title: "Becas Municipales", icon: schoolOutline, desc: "Apoyo económico para el financiamiento de estudios" }
  ];

  return (
    <IonPage>
      <CustomHeader defaultHref="/MenuPrincipal" />
      
      <IonContent>
        <PageLayout>
          {/* Usamos el contenedor global con un ancho mayor para la grilla */}
          <MainCard title="Trámites Ciudadanos" maxWidth="1100px">
            
            <div className="filter-container">
              <IonLabel className="filter-label">Sucursal</IonLabel>
              <IonSelect 
                value={sucursal} 
                className="sucursal-select"
                onIonChange={e => setSucursal(e.detail.value)}
              >
                <IonSelectOption value="Valparaiso">Valparaiso</IonSelectOption>
                <IonSelectOption value="Santo Domingo">Santo Domingo</IonSelectOption>
              </IonSelect>
            </div>

            <IonGrid>
              <IonRow>
                {listaTramites.map((item, index) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={index}>
                    <ProcedureCard 
                      title={item.title}
                      description={item.desc}
                      icon={item.icon}
                      onDetailClick={() => console.log("Navegando a detalle...")}
                    />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default Tramites;