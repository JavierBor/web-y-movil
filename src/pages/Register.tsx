import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCheckbox, 
  IonItem,
  IonLabel,
  IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; // 🔌 Importamos useHistory para controlar la redirección por código
import './Register.css';

// Componentes de Arquitectura Estandarizada
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

import API from '../services/api';  


const Register: React.FC = () => {
  const history = useHistory(); // 🔌 Inicializamos para redirigir solo si la API responde OK
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    rut: '',
    region: '',
    comuna: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  // Función auxiliar para actualizar campos específicos del objeto de estado
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleRegister = async () => {
      // 1. Validaciones previas en el Frontend
      if (!formData.email || !formData.username || !formData.rut || !formData.password) {
        alert('Por favor, rellene todos los campos obligatorios.');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, verifíquelas.');
        return;
      }

      if (!formData.terms) {
        alert('Debes aceptar los términos y condiciones para continuar.');
        return;
      }

      try {
        // 🚀 2. LLAMADA LIMPIA CON AXIOS (EP 2.4): Enviamos el payload directo al prefijo /auth/register
        // Los headers y la URL base se resuelven de forma automática en el archivo api.ts
        await API.post('/auth/register', {
          rut: formData.rut,
          nombre_usuario: formData.username,
          correo: formData.email,
          region: formData.region,
          comuna: formData.comuna,
          contrasena: formData.password // Clave mapeada correctamente
        });

        // Si Axios no arrojó un error en el interceptor, la inserción en Postgres fue exitosa
        alert('¡Cuenta creada con éxito! El servidor aplicó Bcrypt de forma automática.');
        history.push('/Login'); // Redirección fluida controlada por código

      } catch (error: any) {
        // El catch ahora recibe el mensaje limpio y procesado desde el interceptor global
        console.error('Error en proceso de registro:', error);
        alert(error.message); 
      }
    };
    
  return (
    <IonPage>
      <CustomHeader defaultHref="/Login" />

      <IonContent>
        <PageLayout>
          <MainCard title="Registrar Cuenta" maxWidth="900px">
            
            <IonGrid className="ion-no-padding">
              <IonRow>
                {/* COLUMNA IZQUIERDA */}
                <IonCol size="12" sizeMd="6" className="register-col-padding">
                  <CustomInput 
                    label="Correo Electrónico"
                    placeholder="correo@ejemplo.cl"
                    type="email"
                    value={formData.email}
                    onIonChange={(val) => updateField('email', val)}
                  />

                  <CustomInput 
                    label="Nombre de Usuario"
                    placeholder="JuanPerez123"
                    value={formData.username}
                    onIonChange={(val) => updateField('username', val)}
                  />

                  <CustomInput 
                    label="Comuna"
                    placeholder="Santo Domingo"
                    value={formData.comuna}
                    onIonChange={(val) => updateField('comuna', val)}
                  />

                  <CustomInput 
                    label="Contraseña"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onIonChange={(val) => updateField('password', val)}
                  />
                </IonCol>

                {/* COLUMNA DERECHA */}
                <IonCol size="12" sizeMd="6" className="register-col-padding">
                  <CustomInput 
                    label="RUT"
                    placeholder="12.345.678-9"
                    value={formData.rut}
                    onIonChange={(val) => updateField('rut', val)}
                  />

                  <CustomInput 
                    label="Región"
                    placeholder="Valparaíso"
                    value={formData.region}
                    onIonChange={(val) => updateField('region', val)}
                  />

                  <CustomInput 
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onIonChange={(val) => updateField('confirmPassword', val)}
                  />

                  <IonItem lines="none" className="terms-checkbox-item">
                    <IonCheckbox 
                      slot="start" 
                      checked={formData.terms}
                      onIonChange={e => updateField('terms', e.detail.checked)}
                    />
                    <IonLabel className="ion-text-wrap">Acepto términos y condiciones</IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>

            <div className="register-actions">
              {/* ⚠️ Quitamos el routerLink directo para que handleRegister maneje el flujo */}
              <IonButton 
                expand="block" 
                onClick={handleRegister} 
                className="btn-register-submit"
              >
                Crear cuenta
              </IonButton>
              
              <IonText color="medium">
                <p style={{marginTop: '15px'}}>
                  ¿Ya tienes cuenta? <a href="/Login" className="login-link">Inicia sesión</a>
                </p>
              </IonText>
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default Register;