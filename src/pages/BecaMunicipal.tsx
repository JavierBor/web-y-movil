import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
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
import { businessOutline, documentTextOutline, cardOutline } from 'ionicons/icons';
import API from '../services/api';
import './BecaMunicipal.css';

const BecaMunicipal: React.FC = () => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Datos del estudiante
    const [nombreEstudiante, setNombreEstudiante] = useState('');
    const [rutEstudiante, setRutEstudiante] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [carrera, setCarrera] = useState('');
    const [nivelEstudio, setNivelEstudio] = useState('');
    const [ingresoFamiliar, setIngresoFamiliar] = useState('');

    // Estado de archivos visuales
    const [documentos, setDocumentos] = useState({
        certificadoAlumno: false,
        concentracionNotas: false,
        certificadoRenta: false,
        fotocopiaCedula: false
    });

    const sucursalId = 2; // ID para Edificio Plaza Cabildo
    const tramiteId = 5;   // ID para Becas Municipales en la tabla catálogo

    const instituciones = [
        'Universidad de Chile', 'Pontificia Universidad Católica', 'Universidad de Santiago',
        'Universidad de Concepción', 'Universidad Técnica Federico Santa María', 'INACAP',
        'DUOC UC', 'Liceo Municipal', 'Colegio Particular', 'Otra institución'
    ];

    const nivelesEstudio = [
        { value: 'basica', label: 'Educación Básica' },
        { value: 'media', label: 'Educación Media' },
        { value: 'superior', label: 'Educación Superior' },
        { value: 'postgrado', label: 'Postgrado' }
    ];

    const rangosIngreso = [
        'Menos de $500.000', '$500.000 - $1.000.000', '$1.000.000 - $1.500.000',
        '$1.500.000 - $2.000.000', 'Más de $2.000.000'
    ];

    const handleSubmit = async () => {
        // 1. Validaciones locales de inputs
        if (!nombreEstudiante || !rutEstudiante || !institucion || !carrera || !nivelEstudio || !ingresoFamiliar) {
            setAlertMessage('Por favor complete todos los campos requeridos');
            setIsSuccess(false);
            setShowAlert(true);
            return;
        }

        // 🛡️ RECOLECCIÓN SEGURA DE CREDENCIALES (EP 2.4 / 2.5)
        const token = localStorage.getItem('token');
        const usuarioSesion = localStorage.getItem('usuario_conectado');
        const usuario = usuarioSesion ? JSON.parse(usuarioSesion) : null;

        if (!token || !usuario || !usuario.id) {
            setAlertMessage('Su sesión ha expirado o es inválida. Por favor, vuelva a ingresar.');
            setIsSuccess(false);
            setShowAlert(true);
            setTimeout(() => history.push('/Login'), 2000);
            return;
        }

        setIsLoading(true);

        try {
            // Payload transaccional unificado e íntegro
            const payload = {
                sucursal_id: sucursalId,
                tramite_id: tramiteId,
                usuario_id: usuario.id, // 🚀 CORREGIDO: Inyectamos la llave foránea obligatoria
                tipo_tramite: 'beca',
                fecha_cita: null,
                hora_cita: null,
                documentos_url: null,
                comprobante_url: null,
                datos_extra: {
                    nombre_estudiante: nombreEstudiante,
                    rut_estudiante: rutEstudiante,
                    institucion: institucion,
                    carrera: carrera,
                    nivel_estudio: nivelEstudio,
                    ingreso_familiar: ingresoFamiliar
                }
            };

            console.log('Despachando postulación de Beca:', payload);
            
            // 🔄 CUMPLE EP 2.4: Consumo API REST adjuntando el token Bearer en los headers de Axios
            const response = await API.post('/tramites', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.ok) {
                setAlertMessage('✅ Solicitud de Beca Municipal enviada correctamente. El comité de becas evaluará su expediente social.');
                setIsSuccess(true);
                setShowAlert(true);
                setTimeout(() => history.push('/MenuPrincipal'), 2500);
            } else {
                setAlertMessage('❌ Error: ' + (response.data.mensaje || 'No se pudo registrar la postulación.'));
                setIsSuccess(false);
                setShowAlert(true);
            }
        } catch (error: any) {
            console.error('Error capturado en BecaMunicipal:', error);
            const mensaje = error.response?.data?.mensaje || error.message || 'Error de pasarela con el backend municipal';
            setAlertMessage('❌ Error en el envío: ' + mensaje);
            setIsSuccess(false);
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            <CustomHeader showBackButton={true} defaultHref="/PlazaCabildoTramites" />
            <IonContent>
                <PageLayout>
                    <MainCard title="Beca Municipal - Nueva Solicitud" maxWidth="900px">
                        <div className="beca-form-container">
                            
                            <div className="beca-info-box">
                                <IonIcon icon={informationCircleOutline} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                <p>Las Becas Municipales están dirigidas a estudiantes de escasos recursos que deseen continuar con sus estudios.</p>
                            </div>

                            <div className="beca-section">
                                <h3>Datos del Estudiante</h3>
                                
                                <CustomInput
                                    label="Nombre Completo del Estudiante *"
                                    value={nombreEstudiante}
                                    onIonChange={setNombreEstudiante}
                                    placeholder="Ej: Juan Pérez González"
                                />
                                
                                <CustomInput
                                    label="RUT del Estudiante *"
                                    value={rutEstudiante}
                                    onIonChange={setRutEstudiante}
                                    placeholder="Ej: 12.345.678-9"
                                />
                                
                                <IonSelect
                                    value={institucion}
                                    placeholder="Seleccione la institución *"
                                    onIonChange={e => setInstitucion(e.detail.value)}
                                    className="beca-select"
                                >
                                    {instituciones.map((i) => (
                                        <IonSelectOption key={i} value={i}>{i}</IonSelectOption>
                                    ))}
                                </IonSelect>
                                
                                <CustomInput
                                    label="Carrera / Curso *"
                                    value={carrera}
                                    onIonChange={setCarrera}
                                    placeholder="Ej: Ingeniería Civil Informática / 4° Medio"
                                />

                                <IonSelect
                                    value={nivelEstudio}
                                    placeholder="Nivel de estudio *"
                                    onIonChange={e => setNivelEstudio(e.detail.value)}
                                    className="beca-select"
                                >
                                    {nivelesEstudio.map((n) => (
                                        <IonSelectOption key={n.value} value={n.value}>{n.label}</IonSelectOption>
                                    ))}
                                </IonSelect>

                                <IonSelect
                                    value={ingresoFamiliar}
                                    placeholder="Ingreso familiar mensual *"
                                    onIonChange={e => setIngresoFamiliar(e.detail.value)}
                                    className="beca-select"
                                >
                                    {rangosIngreso.map((r) => (
                                        <IonSelectOption key={r} value={r}>{r}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </div>

                            <div className="beca-section">
                                <h3>Documentos Requeridos</h3>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                                    Adjunte los siguientes documentos en formato PDF o imagen (máx. 5MB cada uno)
                                </p>

                                <div className="beca-documents">
                                    <UploadItem
                                        icon={documentTextOutline}
                                        title="Certificado Alumno Regular"
                                        description="Emitido por la institución educacional"
                                        isUploaded={documentos.certificadoAlumno}
                                    />

                                    <UploadItem
                                        icon={documentTextOutline}
                                        title="Concentración de Notas"
                                        description="Historial académico del último período"
                                        isUploaded={documentos.concentracionNotas}
                                    />

                                    <UploadItem
                                        icon={businessOutline}
                                        title="Certificado de Renta"
                                        description="Del grupo familiar (emitido por el SII)"
                                        isUploaded={documentos.certificadoRenta}
                                    />

                                    <UploadItem
                                        icon={cardOutline}
                                        title="Fotocopia Cédula de Identidad"
                                        description="Del postulante (ambos lados)"
                                        isUploaded={documentos.fotocopiaCedula}
                                    />
                                </div>
                            </div>

                            <div className="beca-actions">
                                <IonButton 
                                    className="btn-submit-beca" 
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                                </IonButton>
                                
                                <IonButton 
                                    fill="outline" 
                                    className="btn-cancel-beca"
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

export default BecaMunicipal;