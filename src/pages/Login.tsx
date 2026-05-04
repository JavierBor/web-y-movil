import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonInput, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonCard, 
  IonCardContent, 
  IonButtons, 
  IonBackButton, 
  IonImg,
  IonIcon,
  IonText
} from '@ionic/react';
import { personCircleOutline, chevronDownOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    console.log('Iniciando sesión con:', email, password);
    // Aquí irá la lógica de autenticación con JWT más adelante [cite: 51]
  };

  return (
    <IonPage>
      {/* Encabezado con color corporativo */}
      <IonHeader>
        <IonToolbar color="primary">
          
          <div className="header-logo-container">
            {/* Reemplaza 'assets/logo.png' con la ruta real de tu imagen */}
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

      <IonContent className="ion-padding login-background">
        <div className="login-container">
          <h1 className="login-title">Iniciar Sesión</h1>
          
          <IonCard className="login-card">
            <IonCardContent>
              <div className="form-group">
                <IonLabel position="stacked">Correo Electrónico</IonLabel>
                <IonInput 
                  type="email" 
                  value={email} 
                  onIonChange={e => setEmail(e.detail.value!)}
                  className="custom-input"
                />
              </div>

              <div className="form-group">
                <IonLabel position="stacked">Contraseña</IonLabel>
                <IonInput 
                  type="password" 
                  value={password} 
                  onIonChange={e => setPassword(e.detail.value!)}
                  className="custom-input"
                />
              </div>

              <IonButton expand="block" className="ion-margin-top" routerLink="/MenuPrincipal" onClick={handleLogin}>
                Iniciar sesión
              </IonButton>

              <div className="register-section">
                <p>¿No tienes cuenta?</p>
                <IonButton fill="solid" expand="block" routerLink="/register">
                  Registrarse
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;