const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_municipalidad_santo_domingo_2026';

// ==========================================
// 1. POST: Registro de Usuarios REAL con VALIDACIÓN DE INPUTS (Punto 2.6 a)
// URL: POST http://localhost:3000/api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { nombre_usuario, rut, correo, region, comuna, contrasena } = req.body;

        // 🛡️ REQUERIMIENTO 2.6 (a): VALIDACIÓN DE INPUTS EN REGISTER
        const errores = [];

        if (!nombre_usuario || nombre_usuario.trim().length < 3) {
            errores.push("El nombre de usuario es obligatorio y debe tener al menos 3 caracteres.");
        }

        // Validación de formato RUT Chileno básico (con o sin puntos/guion)
        const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/;
        if (!rut || !rutRegex.test(rut)) {
            errores.push("El formato del RUT es inválido.");
        }

        // Validación de formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !emailRegex.test(correo)) {
            errores.push("El correo electrónico no tiene un formato válido.");
        }

        if (!region || region.trim() === "") {
            errores.push("La región es obligatoria.");
        }

        if (!comuna || comuna.trim() === "") {
            errores.push("La comuna es obligatoria.");
        }

        if (!contrasena || contrasena.length < 6) {
            errores.push("La contraseña es obligatoria y debe contener un mínimo de 6 caracteres.");
        }

        // Si se acumuló algún error de formato, frenamos la petición de inmediato
        if (errores.length > 0) {
            return res.status(400).json({
                ok: false,
                mensaje: errores[0], // 🚀 Devuelve el primer error específico de la lista
                errores: errores
            });
        }

        // Verificación adicional: Evitar correos duplicados antes de insertar
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({
                ok: false,
                mensaje: "El correo electrónico ya se encuentra registrado."
            });
        }

        // 1. Encriptar la contraseña (Requisito 2.6 b)
        const salt = await bcrypt.genSalt(10);
        const contrasena_hash = await bcrypt.hash(contrasena, salt);

        // 2. Crear el registro físico en PostgreSQL (Requisito 2.6 d - Protegido por Sequelize)
        const nuevoUsuario = await Usuario.create({
            nombre_usuario,
            rut,
            correo,
            region,
            comuna,
            contrasena_hash 
        });

        res.status(201).json({ 
            ok: true,
            mensaje: "Usuario registrado con éxito en la base de datos",
            usuario: { id: nuevoUsuario.id, name: nuevoUsuario.nombre_usuario }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error interno al registrar el usuario",
            error: error.message
        });
    }
});


// ==========================================
// 2. POST: Inicio de Sesión con VALIDACIÓN DE INPUTS (Punto 2.6 a)
// URL: POST http://localhost:3000/api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 🛡️ REQUERIMIENTO 2.6 (a): VALIDACIÓN DE INPUTS EN LOGIN
        const erroresLogin = [];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !emailRegex.test(correo)) {
            erroresLogin.push("Debe ingresar un correo electrónico válido.");
        }

        if (!contrasena || contrasena.trim() === "") {
            erroresLogin.push("La contraseña de acceso es requerida.");
        }

        // CORREGIDO: Evaluamos el arreglo correcto correspondiente a login
        if (erroresLogin.length > 0) {
            return res.status(400).json({
                ok: false,
                mensaje: erroresLogin[0], // 🚀 Retorna el string exacto del error (ej: "La contraseña es requerida")
                errores: erroresLogin     
            });
        }

        // 1. Buscar al usuario en la base de datos por su correo (Sanitizado por ORM)
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

        // 🔑 3. GENERACIÓN DEL TOKEN JWT (Cumple EP 2.5 y Manejo Seguro 2.6 c)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. MANEJO SEGURO (Requisito 2.6 c): Devolvemos el payload sin contraseñas expuestas
        res.status(200).json({
            ok: true,
            mensaje: "Inicio de sesión exitoso",
            token, 
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
            mensaje: "Error interno del servidor al intentar iniciar sesión, comuníquese con soporte si el problema persiste.",
            error: error.message
        });
    }
});

module.exports = router;