import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonText
} from '@ionic/react';
import './Login.css';

// Componentes de Arquitectura Estandarizada
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    console.log('Iniciando sesión con:', email, password);
    // Próxima parada: Integración con Backend
  };

  return (
    <IonPage>
      <CustomHeader showBackButton={false} />

      <IonContent>
        <PageLayout>
          <MainCard title="Iniciar Sesión" maxWidth="450px">
            
            <div className="login-form">
              {/* Usamos nuestro nuevo componente reutilizable */}
              <CustomInput 
                label="Correo Electrónico"
                type="email"
                placeholder="correo@ejemplo.cl"
                value={email}
                onIonChange={setEmail} 
              />

              <CustomInput 
                label="Contraseña"
                type="password"
                placeholder="********"
                value={password}
                onIonChange={setPassword}
              />

              <IonButton 
                expand="block" 
                className="btn-ingresar" 
                routerLink="/MenuPrincipal" 
                onClick={handleLogin}
              >
                Iniciar sesión
              </IonButton>

              <div className="register-divider">
                <hr /> <span>O</span> <hr />
              </div>

              <div className="register-section">
                <IonText color="medium">
                  <p>¿No tienes cuenta?</p>
                </IonText>
                <IonButton 
                  fill="outline" 
                  expand="block" 
                  routerLink="/register" 
                  className="btn-register-outline"
                >
                  Crear una cuenta nueva
                </IonButton>
              </div>
            </div>

          </MainCard>
        </PageLayout>
      </IonContent>
    </IonPage>
  );
};

export default Login;