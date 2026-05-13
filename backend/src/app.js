const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ 
        mensaje: "Servidor Express funcionando correctamente", 
        estado: 200 
    });
});

// ESTA LÍNEA ES OBLIGATORIA
module.exports = app;