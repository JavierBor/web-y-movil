const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const tramiteRoutes = require('./routes/tramiteRoutes'); 

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json()); // Vital para que Express entienda los datos JSON que le enviemos

// Tu ruta raíz que ya tenías funcionando
app.get('/', (req, res) => {
    res.send('Servidor Express corriendo correctamente');
});

// 2. CONECTAR LAS RUTAS CON UN PREFIJO
// Esto significa que todas las rutas de authRoutes empezarán con /api/auth
app.use('/api/auth', authRoutes);
// Todas las rutas de tramiteRoutes empezarán con /api/tramites
app.use('/api/tramites', tramiteRoutes);

// Middleware global para atrapar errores y evitar que el servidor se caiga
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        ok: false, 
        msg: 'Ocurrió un error interno en el servidor.' 
    });
});

module.exports = app;