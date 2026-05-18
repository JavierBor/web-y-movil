const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite'); // Tu modelo real de trámites

// 1. GET: Obtener todos los trámites (Para el historial del ciudadano o la vista de Admin)
router.get('/', async (req, res) => {
    try {
        const tramites = await Tramite.findAll();
        res.status(200).json({ ok: true, tramites });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: "Error al obtener trámites", error: error.message });
    }
});

// 2. POST: Crear una nueva solicitud de trámite (Cuando el ciudadano postula)
router.post('/', async (req, res) => {
    try {
        // Recibimos los datos del formulario de Ionic
        const { tipo_tramite, descripcion, estado, usuarioId, sucursalId } = req.body;
        
        const nuevoTramite = await Tramite.create({
            tipo_tramite,
            descripcion,
            estado: estado || 'Pendiente', // Por defecto parte en pendiente
            usuarioId, // Clave foránea del ciudadano
            sucursalId // Clave foránea de la oficina municipal
        });

        res.status(201).json({ ok: true, mensaje: "Trámite solicitado con éxito", tramite: nuevoTramite });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: "Error al crear el trámite", error: error.message });
    }
});

// 3. PUT: Actualizar un trámite por ID (Para que el Admin apruebe/rebase o cambie el estado)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, descripcion } = req.body;

        const tramite = await Tramite.findByPk(id);
        if (!tramite) {
            return res.status(404).json({ ok: false, mensaje: "Trámite no encontrado" });
        }

        // Actualizamos los campos
        await tramite.update({ estado, descripcion });

        res.status(200).json({ ok: true, mensaje: "Trámite actualizado con éxito", tramite });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: "Error al actualizar", error: error.message });
    }
});

// 4. DELETE: Eliminar o cancelar un trámite por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tramite = await Tramite.findByPk(id);
        
        if (!tramite) {
            return res.status(404).json({ ok: false, mensaje: "Trámite no encontrado" });
        }

        await tramite.destroy();
        res.status(200).json({ ok: true, mensaje: "Trámite eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: "Error al eliminar", error: error.message });
    }
});

module.exports = router;