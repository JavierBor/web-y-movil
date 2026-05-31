import axios from 'axios';

// Creamos la instancia base con la URL del servidor de tu amigo
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🕵️‍♂️ INTERCEPTOR DE PETICIÓN: Gestión automática de Tokens JWT (Exigencia EP 2.4)
API.interceptors.request.use(
  (config) => {
    // Buscamos el token guardado en tu LocalStorage
    const token = localStorage.getItem('token');
    
    // Si el token existe, lo inyectamos de forma invisible en el Header Authorization
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 INTERCEPTOR DE RESPUESTA: Manejo Centralizado de Errores (Exigencia EP 2.4)
// 🚨 INTERCEPTOR DE RESPUESTA: Manejo Centralizado de Errores (Exigencia EP 2.4)
API.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      // 👇 AGREGA ESTA LÍNEA DE AQUÍ ABAJO PARA VER LA RESPUESTA REAL EN LA CONSOLA:
      console.log("=== ERROR DETECTADO EN EL BACKEND ===", error.response.status, error.response.data);

      const msg = error.response.data.mensaje || error.response.data.error || 'Error del servidor';
      return Promise.reject(new Error(msg));
    }
    return Promise.reject(new Error('No se pudo conectar con el servidor municipal. Asegúrate de encender el backend.'));
  }
);

export default API;