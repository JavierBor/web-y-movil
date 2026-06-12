const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // 🛡️ EF 3: Importamos Helmet contra XSS

const authRoutes = require('./routes/authRoutes');
const tramiteRoutes = require('./routes/tramiteRoutes');

const app = express();

// 🛡️ EF 3: Seguridad de Cabeceras HTTP contra ataques XSS e inyecciones básicas
app.use(helmet());

// 🔒 EF 3: CORS Configurado y Seguro (restringido a tu puerto local del Frontend)
// En tu backend/src/app.js

const opcionesCors = {
  // 🔒 Permitimos explícitamente los dos puertos comunes de desarrollo para que no rebote
  origin: ['http://localhost:8100', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(opcionesCors));
app.use(cors(opcionesCors));

// Middlewares básicos
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor Express corriendo correctamente');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tramites', tramiteRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        ok: false, 
        msg: 'Ocurrió un error interno en el servidor.' 
    });
});

module.exports = app;