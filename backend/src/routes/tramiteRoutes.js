const express = require('express');
const router = express.Router();
const SolicitudTramite = require('../models/SolicitudTramite');

// ==========================================
// 1. POST: Crear una nueva solicitud de trámite (Ciudadano agendando o subiendo docs)
// URL: POST http://localhost:3000/api/tramites
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
            tramite_id 
        } = req.body;

        // 🔐 CANDADO DE SEGURIDAD (Regla de Negocio): Un ciudadano solo puede tener una cita activa a la vez
        // Buscamos si ya existe una solicitud para este usuario que esté 'Pendiente' o 'Confirmada'
        const solicitudActiva = await SolicitudTramite.findOne({
            where: {
                usuario_id,
                tramite_id,
                estado_tramite: ['Pendiente', 'Confirmada']
            }
        });

        // Si se encuentra una coincidencia, bloqueamos el proceso enviando un 400 Bad Request
        if (solicitudActiva) {
            return res.status(400).json({
                ok: false,
                mensaje: "Ya cuentas con una solicitud activa (Pendiente o Confirmada). No puedes agendar un nuevo trámite hasta que el actual finalice o sea rechazado."
            });
        }

        // 🟢 Si el validador pasa limpio, procedemos a escribir en PostgreSQL
        const nuevaSolicitud = await SolicitudTramite.create({
            documentos_url,
            fecha_cita,
            hora_cita,
            comprobante_url,
            usuario_id,   // FK apuntando a usuarios
            sucursal_id,  // FK apuntando a sucursales
            tramite_id,   // FK apuntando al tipo de trámite (catálogo)
            estado_tramite: 'Pendiente' // Aseguramos que empiece en pendiente
        });

        res.status(201).json({
            ok: true,
            mensaje: "Solicitud de trámite ingresada correctamente.",
            solicitud: nuevaSolicitud
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: "Error al procesar la solicitud de trámite",
            error: error.message
        });
    }
});

// ==========================================
// 2. GET: Obtener todas las solicitudes del sistema (Para el panel del Administrador)
// URL: GET http://localhost:3000/api/tramites
// ==========================================
router.get('/', async (req, res) => {
    try {
        const solicitudes = await SolicitudTramite.findAll();
        res.status(200).json({
            ok: true,
            solicitudes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener las solicitudes de trámites",
            error: error.message
        });
    }
});

// ==========================================
// 3. GET por Usuario: Historial personalizado (Para la pantalla "Mis Trámites" en Ionic)
// ==========================================
router.get('/usuario/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const misSolicitudes = await SolicitudTramite.findAll({
            where: { usuario_id }
        });

        res.status(200).json({
            ok: true,
            solicitudes: misSolicitudes
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
// 4. PUT: Modificar el estado del trámite (Para que el Admin apruebe o rechace en GestionTramites.tsx)
// ==========================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_tramite } = req.body;

        // Buscamos la solicitud por su clave primaria
        const solicitud = await SolicitudTramite.findByPk(id);

        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "No se encontró la solicitud con el ID proporcionado"
            });
        }

        // Actualizamos el string del estado
        solicitud.estado_tramite = estado_tramite;
        await solicitud.save();

        res.status(200).json({
            ok: true,
            mensaje: `El estado del trámite ha sido actualizado a: ${estado_tramite}`,
            solicitud
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: "Error al actualizar la solicitud",
            error: error.message
        });
    }
});

// ==========================================
// 5. DELETE: Cancelar o eliminar una solicitud (Para que el ciudadano se arrepienta)
// URL: DELETE http://localhost:3000/api/tramites/5
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filasBorradas = await SolicitudTramite.destroy({ where: { id } });

        if (filasBorradas === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "No se encontró la solicitud que se desea eliminar"
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: "Solicitud de trámite eliminada/cancelada con éxito."
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al intentar eliminar la solicitud",
            error: error.message
        });
    }
});

module.exports = router;