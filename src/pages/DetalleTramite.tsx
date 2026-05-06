import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { 
  idCardOutline, carOutline, schoolOutline, 
  documentTextOutline, homeOutline, medicalOutline 
} from 'ionicons/icons';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import RequirementItem from '../components/RequirementItem';
import './DetalleTramite.css';

const DetalleTramite: React.FC = () => {
  return (
    <IonPage>
      <CustomHeader defaultHref="/agendar" />
      
      <IonContent>
        <PageLayout>
          {/* Usamos el contenedor global con el ancho del mockup */}
          <MainCard title="Tramite: Primera Licencia de Conducir Clase B" maxWidth="900px">
            
            <p className="docs-subtitle">Documentos y Requisitos</p>

            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <RequirementItem 
                    icon={idCardOutline} 
                    title="Cedula de Identidad Vigente" 
                    description="Vigente y en buen estado." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <RequirementItem 
                    icon={carOutline} 
                    title="Hoja de Vida del Conductor" 
                    description="Se obtiene en el Registro Civil." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <RequirementItem 
                    icon={schoolOutline} 
                    title="Certificado de Estudios (Minimo 8 Basico aprobado)" 
                    description="Original o copia legalizada." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <RequirementItem 
                    icon={documentTextOutline} 
                    title="Certificado de Antecedentes" 
                    description="Verificación legal." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <RequirementItem 
                    icon={homeOutline} 
                    title="Certificado de Residencia o Comprobante de Domicilio" 
                    description="Cuenta de servicios, Registro Social de Hogares, etc." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <RequirementItem 
                    icon={medicalOutline} 
                    title="Examenes Medicos (Sensometrico y Psicometrico)" 
                    description="Aprobacion obligatoria." 
                  />
                </IonCol>
              </IoginRow>
            </IonGrid>

            <div className="detalle-footer">
                <IonButton routerLink="/subir-documentos">Continuar</IonButton>
              
               
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default DetalleTramite;