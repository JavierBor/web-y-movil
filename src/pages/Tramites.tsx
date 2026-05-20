import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonSelect, 
  IonSelectOption, 
  IonLabel 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  carOutline, 
  documentTextOutline, 
  trashOutline, 
  businessOutline, 
  schoolOutline 
} from 'ionicons/icons';

// Componentes de Arquitectura
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import ProcedureCard from '../components/ProcedureCard';

import './Tramites.css';

const Tramites: React.FC = () => {
  const history = useHistory();
  
  // Estado para controlar la sucursal seleccionada
  const [sucursal, setSucursal] = useState('Edificio Consistorial Av. Sta Teresa');

  // Datos de los trámites municipales con su respectiva sucursal asignada
  const listaTramites = [
    { 
      title: "Permiso de circulación", 
      icon: carOutline, 
      desc: "Impuesto anual para el tránsito legal de vehículos",
      sucursal: "Edificio Consistorial Av. Sta Teresa"
    },
    { 
      title: "Obtener/Renovar Licencia", 
      icon: documentTextOutline, 
      desc: "Documento oficial que autoriza legalmente a conducir",
      sucursal: "Edificio Consistorial Av. Sta Teresa"
    },
    { 
      title: "Derechos de aseo", 
      icon: trashOutline, 
      desc: "Pago anual por el servicio de retiro de basura",
      sucursal: "Edificio Consistorial Av. Sta Teresa"
    },
    { 
      title: "Patentes Municipales", 
      icon: businessOutline, 
      desc: "Permiso legal para ejercer actividades comerciales",
      sucursal: "Edificio Plaza Cabildo"
    },
    { 
      title: "Becas Municipales", 
      icon: schoolOutline, 
      desc: "Apoyo económico para el financiamiento de estudios",
      sucursal: "Edificio Plaza Cabildo"
    }
  ];

  /**
   * Manejador de navegación programática
   */
  const handleNavigation = (title: string) => {
    if (title === "Obtener/Renovar Licencia") {
      history.push('/detalle-tramite');
    } else if (title === "Derechos de aseo") {
      history.push('/tramites/aseo');
    } else if (title === "Permiso de circulación") {
      history.push('/tramites/permiso-circulacion');
    } else {
      console.log(`Navegación pendiente para: ${title}`);
    }
  };

  // PASO CLAVE: Filtramos el arreglo según el estado actual de la sucursal
  const tramitesFiltrados = listaTramites.filter(tramite => tramite.sucursal === sucursal);

  return (
    <IonPage>
      {/* Header con retorno al menú principal */}
      <CustomHeader defaultHref="/MenuPrincipal" />
      
      <IonContent>
        <PageLayout>
            
          {/* Filtro de Sucursal (Requisito Funcional) */}
          <div className="filter-container">
            <IonLabel className="filter-label">Sucursal</IonLabel>
            <IonSelect 
              value={sucursal} 
              className="sucursal-select"
              interface="popover"
              onIonChange={e => setSucursal(e.detail.value)}
            >
              {/* Opciones disponibles en el dropdown */}
              <IonSelectOption value="Edificio Consistorial Av. Sta Teresa">
                Edificio Consistorial Av. Sta Teresa
              </IonSelectOption>
              <IonSelectOption value="Edificio Plaza Cabildo">
                Edificio Plaza Cabildo
              </IonSelectOption>
            </IonSelect>
          </div>

          {/* Grilla Responsiva de Trámites Filtrados */}
          <IonGrid className="ion-no-padding">
            <IonRow>
              {tramitesFiltrados.map((item, index) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={index}>
                  <ProcedureCard 
                    title={item.title}
                    description={item.desc}
                    icon={item.icon}
                    onDetailClick={() => handleNavigation(item.title)}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default Tramites;