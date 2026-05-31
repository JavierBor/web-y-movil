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
import API from '../services/api';
import './PatenteMunicipal.css';

const PatenteMunicipal: React.FC = () => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Datos del negocio
    const [nombreNegocio, setNombreNegocio] = useState('');
    const [rubro, setRubro] = useState('');
    const [direccionComercial, setDireccionComercial] = useState('');
    const [tipoPatente, setTipoPatente] = useState('');
    
    // Estado de archivos visuales
    const [documentos, setDocumentos] = useState({
        rut: false,
        patenteAnterior: false,
        certificadoDGI: false
    });

    const sucursalId = 2; // ID para Edificio Plaza Cabildo
    const tramiteId = 4;   // ID para Patentes Municipales

    const rubrosComunes = [
        'Comercio minorista', 'Comercio mayorista', 'Restaurante', 'Cafetería',
        'Servicios profesionales', 'Consultoría', 'Construcción', 'Transporte',
        'Turismo', 'Otro'
    ];

    const handleSubmit = async () => {
        // 1. Validaciones de Inputs locales
        if (!nombreNegocio || !rubro || !direccionComercial || !tipoPatente) {
            setAlertMessage('Por favor complete todos los campos requeridos');
            setIsSuccess(false);
            setShowAlert(true);
            return;
        }

        // 🛡️ RECOLECCIÓN SEGURA DE SESIÓN (Unificada con tu Login original)
        const token = localStorage.getItem('token');
        const usuarioSesion = localStorage.getItem('usuario_conectado'); // 🚀 Volvemos a tu clave original
        const usuario = usuarioSesion ? JSON.parse(usuarioSesion) : null;

        // Validamos que existan ambos para no romper la llave foránea en PostgreSQL
        if (!token || !usuario || !usuario.id) {
            setAlertMessage('Su sesión no es válida. Por favor, inicie sesión nuevamente.');
            setIsSuccess(false);
            setShowAlert(true);
            setTimeout(() => history.push('/Login'), 2000);
            return;
        }

        setIsLoading(true);

        try {
            // Payload transaccional estructurado
            const payload = {
                sucursal_id: sucursalId,
                tramite_id: tramiteId,
                usuario_id: usuario.id, // ID real sincronizado de PostgreSQL (1 o 2 en seeding)
                tipo_tramite: 'patente',
                fecha_cita: null,
                hora_cita: null,
                documentos_url: null,
                comprobante_url: null,
                datos_extra: {
                    nombre_negocio: nombreNegocio,
                    rubro: rubro,
                    direccion_comercial: direccionComercial,
                    tipo_patente: tipoPatente
                }
            };

            console.log('Despachando payload transaccional:', payload);
            
            // 🔄 CUMPLE EP 2.4: Consumo API REST adjuntando las credenciales de sesión en headers
            const response = await API.post('/tramites', payload, {
                headers: {
                    Authorization: `Bearer ${token}` // El guardia de authMiddleware.js del backend procesará esto
                }
            });
            
            if (response.data.ok) {
                setAlertMessage('✅ Solicitud de Patente Municipal enviada correctamente. Podrá revisar su estado en el buzón de notificaciones.');
                setIsSuccess(true);
                setShowAlert(true);
                setTimeout(() => history.push('/MenuPrincipal'), 2500);
            } else {
                setAlertMessage('❌ Error: ' + (response.data.mensaje || 'No se pudo procesar la solicitud'));
                setIsSuccess(false);
                setShowAlert(true);
            }
        } catch (error: any) {
            console.error('Error capturado en el controlador del Frontend:', error);
            const mensaje = error.response?.data?.mensaje || error.message || 'Error de conexión con el servidor de Santo Domingo';
            setAlertMessage('❌ Error al enviar solicitud: ' + mensaje);
            setIsSuccess(false);
            setShowAlert(true);
        } finally {
            box_loading: setIsLoading(false);
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
                                    disabled={isLoading}
                                Dino-Btn>
                                    {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
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