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
import API from '../services/api';  // 🔌 Importamos la instancia centralizada de Axios

const Login: React.FC = () => {
  const history = useHistory(); // 👈 Inicializamos el historial de rutas
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

const handleLogin = async () => {
    // 1. Validaciones básicas en el frontend
    if (!email || !password) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      // 🚀 2. Petición HTTP optimizada con Axios (EP 2.4)
      // Enviamos el correo y la clave al endpoint que configuró tu amigo
      const response = await API.post('/auth/login', {
        correo: email,
        contrasena: password
      });

      // 🔑 3. GUARDAR EL TOKEN JWT (Exigencia crítica EP 2.5)
      // Asumiendo que el backend responde con { token: "ey...", usuario: {...} }
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token); // Aquí se almacena para el interceptor
      }

      alert('¡Inicio de sesión exitoso!');
      
      // 🔄 4. Redirección al Home o Panel Principal de trámites
      history.push('/MenuPrincipal'); 

    } catch (error: any) {
      // Si las credenciales fallan, el interceptor de api.ts nos entrega el error limpio
      console.error('Error en el login:', error);
      alert(error.message || 'Credenciales incorrectas.');
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