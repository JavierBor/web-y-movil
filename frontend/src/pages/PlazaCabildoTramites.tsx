import React from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import { useHistory } from 'react-router-dom';
import './PlazaCabildoTramites.css';

const PlazaCabildoTramites: React.FC = () => {
    const history = useHistory();

    console.log("PlazaCabildoTramites cargado correctamente");

    const goToPatente = () => {
        console.log("🟢 Click en Patente Municipal - Navegando a /PatenteMunicipal");
        history.push('/PatenteMunicipal');
    };

    const goToBeca = () => {
        console.log("🔵 Click en Beca Municipal - Navegando a /BecaMunicipal");
        history.push('/BecaMunicipal');
    };

    return (
        <IonPage>
            <CustomHeader showBackButton={true} defaultHref="/MenuPrincipal" />
            <IonContent>
                <PageLayout>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1>Edificio Plaza Cabildo</h1>
                        <p>Seleccione el trámite que desea realizar</p>
                    </div>

                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" sizeMd="6">
                                <MainCard title="Patentes Municipales" maxWidth="100%">
                                    <p>Permiso legal para ejercer actividades comerciales</p>
                                    <IonButton 
                                        expand="block" 
                                        onClick={goToPatente}
                                        style={{ marginTop: '20px' }}
                                    >
                                        VER DETALLES
                                    </IonButton>
                                </MainCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="6">
                                <MainCard title="Becas Municipales" maxWidth="100%">
                                    <p>Apoyo económico para el financiamiento de estudios</p>
                                    <IonButton 
                                        expand="block" 
                                        onClick={goToBeca}
                                        style={{ marginTop: '20px' }}
                                    >
                                        VER DETALLES
                                    </IonButton>
                                </MainCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </PageLayout>
            </IonContent>
        </IonPage>
    );
};

export default PlazaCabildoTramites;