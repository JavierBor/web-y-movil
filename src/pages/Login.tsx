import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; // 👈 Importamos para controlar la navegación por código
import './Login.css';

// Componentes de Arquitectura Estandarizada
import CustomHeader from '../components/CustomHeader';
import PageLayout from '../components/PageLayout';
import MainCard from '../components/MainCard';
import CustomInput from '../components/CustomInput';

const Login: React.FC = () => {
  const history = useHistory(); // 👈 Inicializamos el historial de rutas
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    // Validación rápida antes de gastar recursos de red
    if (!email || !password) {
      alert('Por favor, rellene todos los campos.');
      return;
    }

    try {
      // Petición POST al endpoint que acabamos de validar en Postman
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Mapeamos 'email' a 'correo' y 'password' a 'contrasena' según lo que espera el backend
        body: JSON.stringify({
          correo: email,
          contrasena: password
        })
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        console.log('Autenticación exitosa en Santo Domingo:', datos);
        
        // 💾 Guardamos la sesión de forma persistente para usarla en los formularios de trámites
        localStorage.setItem('usuario_conectado', JSON.stringify(datos.usuario));
        
        // Redirección condicional: ¡Solo entra si las credenciales son válidas!
        history.push('/MenuPrincipal');
      } else {
        // Muestra el mensaje exacto que configuramos en el backend (ej: "La contraseña es incorrecta")
        alert(datos.mensaje);
      }

    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      alert('No se pudo conectar con el servidor municipal. Asegúrate de que el backend esté encendido.');
    }
  };

  return (
    <IonPage>
      <CustomHeader showBackButton={false} />

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

              {/* ⚠️ Quitamos routerLink para que handleLogin decida si se cambia de pantalla o no */}
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