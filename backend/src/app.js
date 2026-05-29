const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const tramiteRoutes = require('./routes/tramiteRoutes');
// Comenta o elimina estas si no las usas
// const becaRoutes = require('./routes/becaRoutes');
// const patenteRoutes = require('./routes/patenteRoutes');

const app = express();

// Middlewares básicos
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor Express corriendo correctamente');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tramites', tramiteRoutes);
// app.use('/api/becas', becaRoutes);
// app.use('/api/patentes', patenteRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        ok: false, 
        msg: 'Ocurrió un error interno en el servidor.' 
    });
});

module.exports = app;