const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt'); // Importar la librería de encriptación

// Ruta para Registro de Usuarios REAL
router.post('/register', async (req, res) => {
    try {
        // Extraemos los campos que vienen desde el cuerpo de la petición (req.body)
        const { nombre_usuario, rut, correo, region, comuna, contrasena } = req.body;

        // 1. Encriptar la contraseña para cumplir con el requisito de seguridad
        const salt = await bcrypt.genSalt(10);
        const contrasena_hash = await bcrypt.hash(contrasena, salt);

        // 2. Crear el registro físico en PostgreSQL usando Sequelize
        const nuevoUsuario = await Usuario.create({
            nombre_usuario,
            rut,
            correo,
            region,
            comuna,
            contrasena_hash // Guardar la clave ya protegida en la columna correspondiente
        });

        // 3. Responder con éxito en formato JSON al cliente
        res.status(201).json({ 
            ok: true,
            mensaje: "Usuario registrado con éxito en la base de datos",
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre_usuario }
        });

    } catch (error) {
        // Manejo de errores por si el RUT o Correo ya existen (Restricción de integridad UNIQUE)
        res.status(400).json({
            ok: false,
            mensaje: "Error al registrar el usuario",
            error: error.message
        });
    }
});


// Ruta para Inicio de Sesión 
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 1. Buscar al usuario en la base de datos por su correo
        const usuario = await Usuario.findOne({ where: { correo } });
        
        // Si no existe el correo, devolver 404 (Not Found)
        if (!usuario) {
            return res.status(404).json({ 
                ok: false, 
                mensaje: "El correo electrónico no está registrado" 
            });
        }

        // 2. Comparar la contraseña ingresada con la encriptada en la DB
        const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
        
        // Si no coincide, devolver 401 (Unauthorized)
        if (!contraseñaValida) {
            return res.status(401).json({ 
                ok: false, 
                mensaje: "La contraseña es incorrecta" 
            });
        }
        // 3. Si todo es correcto, devolver un mensaje de éxito con los datos del usuario
        res.status(200).json({
            ok: true,
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_usuario,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        // Error interno del servidor 500
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al intentar iniciar sesión",
            error: error.message
        });
    }
});

module.exports = router;
