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
import MainCard from '../components/MainCard';
import ProcedureCard from '../components/ProcedureCard';



import './Tramites.css';

const Tramites: React.FC = () => {
  const history = useHistory();
  const [sucursal, setSucursal] = useState('Edificio Consistorial Av. Sta Teresa');

  // Datos de los trámites municipales
  const listaTramites = [
    { 
      title: "Permiso de circulación", 
      icon: carOutline, 
      desc: "Impuesto anual para el tránsito legal de vehículos" 
    },
    { 
      title: "Obtener/Renovar Licencia", 
      icon: documentTextOutline, 
      desc: "Documento oficial que autoriza legalmente a conducir" 
    },
    { 
      title: "Derechos de aseo", 
      icon: trashOutline, 
      desc: "Pago anual por el servicio de retiro de basura" 
    },
    { 
      title: "Patentes Municipales", 
      icon: businessOutline, 
      desc: "Permiso legal para ejercer actividades comerciales" 
    },
    { 
      title: "Becas Municipales", 
      icon: schoolOutline, 
      desc: "Apoyo económico para el financiamiento de estudios" 
    }
  ];

  /**
   * Manejador de navegación programática
   * Redirige al detalle específico según el trámite seleccionado
   */
  const handleNavigation = (title: string) => {
    if (title === "Obtener/Renovar Licencia") {
      history.push('/detalle-tramite');
    } else {
      // Implementación futura para otros trámites
      console.log(`Navegación pendiente para: ${title}`);
    }
    if (title === "Derechos de aseo") {
      history.push('/tramites/aseo');
    }
    if (title === "Permiso de circulación") {
      history.push('/tramites/permiso-circulacion');
    }
  };

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
                <IonSelectOption value="Edificio Consistorial Av. Sta Teresa">Edificio Consistorial Av. Sta Teresa</IonSelectOption>
              </IonSelect>
            </div>

            {/* Grilla Responsiva de Trámites */}
            <IonGrid className="ion-no-padding">
              <IonRow>
                {listaTramites.map((item, index) => (
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