const express = require('express');
const router = express.Router();
const SolicitudTramite = require('../models/SolicitudTramite');

// ==========================================
// 1. POST: Crear una nueva solicitud de trámite
// ==========================================
router.post('/', async (req, res) => {
    try {
        const { 
            documentos_url, 
            fecha_cita, 
            hora_cita, 
            comprobante_url, 
            usuario_id, 
            sucursal_id, 
            tramite_id,
            datos_extra,
            tipo_tramite
        } = req.body;

        // Verificar solicitud activa
        const solicitudActiva = await SolicitudTramite.findOne({
            where: {
                usuario_id,
                tramite_id,
                estado_tramite: ['Pendiente', 'Confirmada']
            }
        });

        if (solicitudActiva) {
            return res.status(400).json({
                ok: false,
                mensaje: "Ya cuentas con una solicitud activa. No puedes agendar un nuevo trámite hasta que el actual finalice."
            });
        }

        const nuevaSolicitud = await SolicitudTramite.create({
            documentos_url,
            fecha_cita,
            hora_cita,
            comprobante_url,
            usuario_id,
            sucursal_id,
            tramite_id,
            datos_extra: datos_extra || {},
            tipo_tramite: tipo_tramite || 'general',
            estado_tramite: 'Pendiente'
        });

        res.status(201).json({
            ok: true,
            mensaje: "Solicitud de trámite ingresada correctamente.",
            solicitud: nuevaSolicitud
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al procesar la solicitud",
            error: error.message
        });
    }
});

// ==========================================
// 2. GET: Obtener todas las solicitudes
// ==========================================
router.get('/', async (req, res) => {
    try {
        const solicitudes = await SolicitudTramite.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            ok: true,
            solicitudes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener las solicitudes",
            error: error.message
        });
    }
});

// ==========================================
// 3. GET: Solicitudes por usuario
// ==========================================
router.get('/usuario/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const solicitudes = await SolicitudTramite.findAll({
            where: { usuario_id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            ok: true,
            solicitudes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener el historial del usuario",
            error: error.message
        });
    }
});

// ==========================================
// 4. PUT: Actualizar estado del trámite
// ==========================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_tramite } = req.body;

        const solicitud = await SolicitudTramite.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        solicitud.estado_tramite = estado_tramite;
        await solicitud.save();

        res.status(200).json({
            ok: true,
            mensaje: `Estado actualizado a: ${estado_tramite}`,
            solicitud
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al actualizar",
            error: error.message
        });
    }
});

// ==========================================
// 5. DELETE: Eliminar solicitud
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filasBorradas = await SolicitudTramite.destroy({ where: { id } });

        if (filasBorradas === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: "Solicitud eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al eliminar",
            error: error.message
        });
    }
});

module.exports = router;