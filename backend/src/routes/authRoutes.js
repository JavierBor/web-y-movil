const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); // 🔑 Importamos la librería para generar los tokens seguros

// Clave secreta para firmar los tokens (Idealmente viene de un archivo .env)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_municipalidad_santo_domingo_2026';

// ==========================================
// 1. POST: Registro de Usuarios REAL
// URL: POST http://localhost:3000/api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
    try {
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

        res.status(201).json({ 
            ok: true,
            mensaje: "Usuario registrado con éxito en la base de datos",
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre_usuario }
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: "Error al registrar el usuario",
            error: error.message
        });
    }
});


// ==========================================
// 2. POST: Inicio de Sesión con Firma Digital (JWT)
// URL: POST http://localhost:3000/api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 1. Buscar al usuario en la base de datos por su correo
        const usuario = await Usuario.findOne({ where: { correo } });
        
        if (!usuario) {
            return res.status(404).json({ 
                ok: false, 
                mensaje: "El correo electrónico no está registrado" 
            });
        }

        // 2. Comparar la contraseña ingresada con la encriptada en la DB
        const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
        
        if (!contraseñaValida) {
            return res.status(401).json({ 
                ok: false, 
                mensaje: "La contraseña es incorrecta" 
            });
        }

        // 🔑 3. GENERACIÓN DEL TOKEN JWT (Cumple EP 2.5)
        // Guardamos el ID y el Rol dentro del token para que el frontend los use de forma segura
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '24h' } // El token expirará automáticamente en 24 horas
        );

        // 4. Si todo es correcto, devolvemos el token y el objeto usuario esperados por Axios
        res.status(200).json({
            ok: true,
            mensaje: "Inicio de sesión exitoso",
            token, // 👈 Aquí viaja el token que guardará tu frontend
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_usuario,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al intentar iniciar sesión",
            error: error.message
        });
    }
});

module.exports = router;