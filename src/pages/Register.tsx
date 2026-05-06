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
import './Register.css';

// Componentes de Arquitectura Estandarizada
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

const Register: React.FC = () => {
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

  const handleRegister = () => {
    console.log('Datos de registro:', formData);
    // Lógica futura: validaciones y envío a API
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
              <IonButton 
                expand="block" 
                onClick={handleRegister} 
                routerLink='/MenuPrincipal'
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