import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonAlert,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import './Login.css';

import CustomHeader  from '../components/CustomHeader';
import PageLayout    from '../components/PageLayout';
import MainCard      from '../components/MainCard';
import CustomInput   from '../components/CustomInput';
import API           from '../services/api';
import { useAuth }   from '../context/AuthContext';

interface LocationState {
  from?: { pathname: string };
}

const Login: React.FC = () => {
  const history  = useHistory();
  const location = useLocation<LocationState>();
  const { login } = useAuth();

  const [email,    setEmail]    = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Para el alert de elección de modo (admin)
  const [showModeAlert, setShowModeAlert] = useState(false);
  const [usuarioTemp,   setUsuarioTemp]   = useState<any>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      const response = await API.post('/auth/login', {
        correo:    email,
        contrasena: password,
      });

      const { token, usuario } = response.data;

      // ── Guarda en AuthContext + localStorage (mismas claves) ──
      login(token, usuario);

      alert('¡Inicio de sesión exitoso!');

      if (usuario.rol === 'admin') {
        // Admin elige cómo navegar
        setUsuarioTemp(usuario);
        setShowModeAlert(true);
      } else {
        // Usuario normal: va a donde intentaba ir, o al menú
        const destino = location.state?.from?.pathname ?? '/MenuPrincipal';
        history.replace(destino);
      }

    } catch (error: any) {
      console.error('Error en el login:', error);
      alert(error.message || 'Credenciales incorrectas.');
    }
  };

  return (
    <IonPage>
      <CustomHeader showBackButton={false} showAccountButton={false} />

      <IonContent>
        <PageLayout>
          <MainCard title="Iniciar Sesión" maxWidth="450px">
            <div className="login-form">

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
                  routerLink="/Register"
                  className="btn-register-outline"
                >
                  Crear una cuenta nueva
                </IonButton>
              </div>

            </div>
          </MainCard>
        </PageLayout>
      </IonContent>

      {/* Alert para elegir modo cuando el usuario es admin */}
      <IonAlert
        isOpen={showModeAlert}
        onDidDismiss={() => setShowModeAlert(false)}
        header="Seleccionar Modo"
        message={`${usuarioTemp?.nombre}, ¿cómo deseas navegar?`}
        buttons={[
          {
            text: 'Modo Ciudadano',
            handler: () => history.replace('/MenuPrincipal'),
          },
          {
            text: 'Modo Administrador',
            handler: () => history.replace('/AdminMenu'),
          },
        ]}
      />
    </IonPage>
  );
};

export default Login;