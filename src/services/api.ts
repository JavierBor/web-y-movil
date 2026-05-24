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
API.interceptors.response.use(
  (response) => response, // Si la API responde bien (200, 201), pasa de largo
  (error) => {
    // Si el servidor arroja un error controlado por tu amigo (ej: 400, 401, 500)
    if (error.response) {
      const msg = error.response.data.mensaje || error.response.data.error || 'Error del servidor';
      return Promise.reject(new Error(msg));
    }
    // Si el servidor está derechamente apagado
    return Promise.reject(new Error('No se pudo conectar con el servidor municipal. Asegúrate de encender el backend.'));
  }
);

export default API;