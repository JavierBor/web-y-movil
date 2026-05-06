import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { 
  idCardOutline, carOutline, schoolOutline, 
  documentTextOutline, homeOutline, eyeOutline 
} from 'ionicons/icons';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import UploadItem from '../components/UploadItem';

const SubirDocumentos: React.FC = () => {
  return (
    <IonPage>
      <CustomHeader defaultHref="/detalle-tramite" />
      
      <IonContent>
        <PageLayout>
          <MainCard title="Subir Documentos (Licencia Clase B)" maxWidth="1000px">
            
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', marginBottom: '30px' }}>
              Por favor, adjunte cada uno de los archivos requeridos a continuación en formato digital (PDF o imagen, JPG/PNG, max 5MB). Asegurese de que sean legibles y actualizados.
            </p>

            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={idCardOutline} 
                    title="Cedula de Identidad Vigente" 
                    description="Vigente y en buen estado." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={carOutline} 
                    title="Hoja de Vida del Conductor" 
                    description="Se obtiene en el Registro Civil." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={schoolOutline} 
                    title="Certificado de Estudios (Minimo 8 Basico aprobado)" 
                    description="Original o copia legalizada." 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={documentTextOutline} 
                    title="Certificado de Antecedentes" 
                    description="Verificacion legal." 
                    isUploaded={true} 
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={homeOutline} 
                    title="Certificado de Residencia o Comprobante de Domicilio" 
                    description="Cuenta de servicios, Registro Social de Hogares, etc." 
                    isUploaded={true}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" style={{ padding: '8px' }}>
                  <UploadItem 
                    icon={eyeOutline} 
                    title="Examenes Medicos (Sensometrico y Psicometrico)" 
                    description="Aprobacion obligatoria." 
                    isUploaded={true}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <IonButton className="btn-enviar-todo" routerLink="/seleccionar-fecha">
                Enviar Documentos y Continuar
              </IonButton>
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default SubirDocumentos;