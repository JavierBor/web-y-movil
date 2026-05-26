import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonText, 
  IonSelect, 
  IonSelectOption, 
  IonAlert,
  IonIcon
} from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';
import UploadItem from '../components/UploadItem';
import { documentTextOutline, businessOutline, documentOutline } from 'ionicons/icons';
import axios from 'axios';
import './PatenteMunicipal.css';

const PatenteMunicipal: React.FC = () => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Datos del negocio
    const [nombreNegocio, setNombreNegocio] = useState('');
    const [rubro, setRubro] = useState('');
    const [direccionComercial, setDireccionComercial] = useState('');
    const [tipoPatente, setTipoPatente] = useState('');
    
    // Estado de archivos
    const [documentos, setDocumentos] = useState({
        rut: false,
        patenteAnterior: false,
        certificadoDGI: false
    });

    // Obtener usuario de localStorage
    const usuarioConectado = localStorage.getItem('usuario_conectado');
    const usuario = usuarioConectado ? JSON.parse(usuarioConectado) : null;
    const sucursalId = 1; // ID para Edificio Plaza Cabildo

    const rubrosComunes = [
        'Comercio minorista',
        'Comercio mayorista',
        'Restaurante',
        'Cafetería',
        'Servicios profesionales',
        'Consultoría',
        'Construcción',
        'Transporte',
        'Turismo',
        'Otro'
    ];

    const handleSubmit = async () => {
        if (!nombreNegocio || !rubro || !direccionComercial || !tipoPatente) {
            setAlertMessage('Por favor complete todos los campos requeridos');
            setIsSuccess(false);
            setShowAlert(true);
            return;
        }

        if (!usuario) {
            setAlertMessage('Debe iniciar sesión para realizar esta solicitud');
            setIsSuccess(false);
            setShowAlert(true);
            history.push('/Login');
            return;
        }

        const formData = new FormData();
        formData.append('nombre_negocio', nombreNegocio);
        formData.append('rubro', rubro);
        formData.append('direccion_comercial', direccionComercial);
        formData.append('tipo_patente', tipoPatente);
        formData.append('usuario_id', usuario.id);
        formData.append('sucursal_id', sucursalId.toString());

        try {
            const response = await axios.post('http://localhost:3000/api/patentes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.ok) {
                setAlertMessage('✅ Solicitud de Patente Municipal enviada correctamente. Se le notificará por correo el estado de su solicitud.');
                setIsSuccess(true);
                setShowAlert(true);
                setTimeout(() => history.push('/MenuPrincipal'), 2500);
            }
        } catch (error: any) {
            setAlertMessage('❌ Error: ' + (error.response?.data?.mensaje || 'No se pudo enviar la solicitud'));
            setIsSuccess(false);
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <CustomHeader showBackButton={true} defaultHref="/PlazaCabildoTramites" />
            <IonContent>
                <PageLayout>
                    <MainCard title="Patente Municipal - Nueva Solicitud" maxWidth="900px">
                        <div className="patente-form-container">
                            
                            <div className="info-box">
                                <IonIcon icon={informationCircleOutline} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                <p>La Patente Municipal es el permiso obligatorio para ejercer actividades comerciales, industriales o profesionales en la comuna.</p>
                            </div>

                            <div className="patente-section">
                                <h3>Datos del Negocio</h3>
                                
                                <CustomInput
                                    label="Nombre del Negocio o Razón Social *"
                                    value={nombreNegocio}
                                    onIonChange={setNombreNegocio}
                                    placeholder="Ej: Comercial XYZ Ltda."
                                />
                                
                                <IonSelect
                                    value={rubro}
                                    placeholder="Seleccione el rubro *"
                                    onIonChange={e => setRubro(e.detail.value)}
                                    className="patente-select"
                                >
                                    {rubrosComunes.map((r) => (
                                        <IonSelectOption key={r} value={r}>{r}</IonSelectOption>
                                    ))}
                                </IonSelect>
                                
                                <CustomInput
                                    label="Dirección Comercial *"
                                    value={direccionComercial}
                                    onIonChange={setDireccionComercial}
                                    placeholder="Ej: Av. Principal 123, Santo Domingo"
                                />

                                <IonSelect
                                    value={tipoPatente}
                                    placeholder="Tipo de patente *"
                                    onIonChange={e => setTipoPatente(e.detail.value)}
                                    className="patente-select"
                                >
                                    <IonSelectOption value="comercial">Comercial</IonSelectOption>
                                    <IonSelectOption value="industrial">Industrial</IonSelectOption>
                                    <IonSelectOption value="profesional">Profesional</IonSelectOption>
                                    <IonSelectOption value="servicios">Servicios</IonSelectOption>
                                </IonSelect>
                            </div>

                            <div className="patente-section">
                                <h3>Documentos Requeridos</h3>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                                    Adjunte los siguientes documentos en formato PDF o imagen (máx. 5MB cada uno)
                                </p>

                                <div className="patente-documents">
                                    <UploadItem
                                        icon={documentOutline}
                                        title="Fotocopia del RUT"
                                        description="Documento que acredite la identidad del solicitante"
                                        isUploaded={documentos.rut}
                                    />

                                    <UploadItem
                                        icon={businessOutline}
                                        title="Patente anterior (si existe)"
                                        description="Última patente municipal pagada (solo para renovación)"
                                        isUploaded={documentos.patenteAnterior}
                                    />

                                    <UploadItem
                                        icon={documentTextOutline}
                                        title="Certificado DGI"
                                        description="Certificado de Inscripción en Dirección General de Impuestos"
                                        isUploaded={documentos.certificadoDGI}
                                    />
                                </div>
                            </div>

                            <div className="patente-actions">
                                <IonButton 
                                    className="btn-submit-patente" 
                                    onClick={handleSubmit}
                                >
                                    Enviar Solicitud
                                </IonButton>
                                
                                <IonButton 
                                    fill="outline" 
                                    className="btn-cancel-patente"
                                    routerLink="/PlazaCabildoTramites"
                                >
                                    Cancelar
                                </IonButton>
                            </div>

                        </div>
                    </MainCard>
                </PageLayout>
            </IonContent>

            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={isSuccess ? 'Solicitud Enviada' : 'Error en la Solicitud'}
                message={alertMessage}
                buttons={['OK']}
            />
        </IonPage>
    );
};

export default PatenteMunicipal;