import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonInput, IonButton, 
  IonLabel, IonCard, IonCardContent, IonButtons, IonBackButton, 
  IonImg, IonIcon, IonGrid, IonRow, IonCol, IonCheckbox, IonItem
} from '@ionic/react';
import { personCircleOutline, chevronDownOutline } from 'ionicons/icons';
import './Register.css';

const Register: React.FC = () => {
  // Estados para capturar los datos requeridos por la pauta
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

  const handleRegister = () => {
    console.log('Datos de registro:', formData);
    // Próximamente: validaciones y envío a API con JWT 
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" text="Inicio" />
          </IonButtons>
          
          <div className="header-logo-container">
            <IonImg src="public/logo.png" className="header-logo" alt="Logo Municipalidad" />
          </div>
          <h1 className="header-title">Municipalidad Santo Domingo</h1>

          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="start" icon={personCircleOutline} />
              Mi Cuenta
              <IonIcon slot="end" icon={chevronDownOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding register-background">
        <div className="register-container">
          <h1 className="register-title">Registrar cuenta</h1>
          
          <IonCard className="register-card">
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  {/* Columna Izquierda */}
                  <IonCol size="12" sizeMd="6">
                    <div className="form-group">
                      <IonLabel position="stacked">Correo Electrónico</IonLabel>
                      <IonInput 
                        className="custom-input"
                        value={formData.email}
                        onIonChange={e => setFormData({...formData, email: e.detail.value!})}
                      />
                    </div>
                    <div className="form-group">
                      <IonLabel position="stacked">Nombre de usuario</IonLabel>
                      <IonInput 
                        className="custom-input"
                        value={formData.username}
                        onIonChange={e => setFormData({...formData, username: e.detail.value!})}
                      />
                    </div>
                    <div className="form-group">
                      <IonLabel position="stacked">Comuna</IonLabel>
                      <IonInput 
                        className="custom-input"
                        value={formData.comuna}
                        onIonChange={e => setFormData({...formData, comuna: e.detail.value!})}
                      />
                    </div>
                    <div className="form-group">
                      <IonLabel position="stacked">Confirmar contraseña</IonLabel>
                      <IonInput 
                        type="password"
                        className="custom-input"
                        value={formData.confirmPassword}
                        onIonChange={e => setFormData({...formData, confirmPassword: e.detail.value!})}
                      />
                    </div>
                  </IonCol>

                  {/* Columna Derecha */}
                  <IonCol size="12" sizeMd="6">
                    <div className="form-group">
                      <IonLabel position="stacked">RUT</IonLabel>
                      <IonInput 
                        className="custom-input"
                        value={formData.rut}
                        onIonChange={e => setFormData({...formData, rut: e.detail.value!})}
                      />
                    </div>
                    <div className="form-group">
                      <IonLabel position="stacked">Región</IonLabel>
                      <IonInput 
                        className="custom-input"
                        value={formData.region}
                        onIonChange={e => setFormData({...formData, region: e.detail.value!})}
                      />
                    </div>
                    <div className="form-group">
                      <IonLabel position="stacked">Contraseña</IonLabel>
                      <IonInput 
                        type="password"
                        className="custom-input"
                        value={formData.password}
                        onIonChange={e => setFormData({...formData, password: e.detail.value!})}
                      />
                    </div>

                    <IonItem lines="none" className="terms-item">
                      <IonCheckbox 
                        slot="start" 
                        checked={formData.terms}
                        onIonChange={e => setFormData({...formData, terms: e.detail.checked})}
                      />
                      <IonLabel>Acepto términos y condiciones</IonLabel>
                    </IonItem>

                    <div className="button-container">
                      <IonButton expand="block" onClick={handleRegister} routerLink="/MenuPrincipal">
                        Registrarse
                      </IonButton>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;