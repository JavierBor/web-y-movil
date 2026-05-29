// backend/src/routes/tramitesRoutes.js
// Cambios respecto al original:
//   - verificarToken  → aplicado en todas las rutas (usuario debe estar logueado)
//   - verificarAdmin  → aplicado en PUT y DELETE (solo admin puede cambiar estado o borrar)
//   - GET /usuario/:id → verifica que el usuario solo acceda a sus propios trámites

const express = require('express');
const router  = express.Router();
const SolicitudTramite = require('../models/SolicitudTramite');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// ══════════════════════════════════════════════════════════
// POST /api/tramites — Crear nueva solicitud
// Requiere: usuario autenticado
// ══════════════════════════════════════════════════════════
router.post('/', verificarToken, async (req, res) => {
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

    // Verificar que no haya una solicitud activa para el mismo trámite
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
        mensaje: 'Ya cuentas con una solicitud activa. No puedes agendar un nuevo trámite hasta que el actual finalice.'
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
      datos_extra:   datos_extra   || {},
      tipo_tramite:  tipo_tramite  || 'general',
      estado_tramite: 'Pendiente'
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Solicitud de trámite ingresada correctamente.',
      solicitud: nuevaSolicitud
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al procesar la solicitud',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// GET /api/tramites — Obtener todas las solicitudes
// Requiere: admin
// ══════════════════════════════════════════════════════════
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const solicitudes = await SolicitudTramite.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ ok: true, solicitudes });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener las solicitudes',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// GET /api/tramites/usuario/:usuario_id — Solicitudes del usuario
// Requiere: usuario autenticado, y solo puede ver las suyas
// ══════════════════════════════════════════════════════════
router.get('/usuario/:usuario_id', verificarToken, async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Un usuario solo puede ver sus propios trámites;
    // un admin puede ver los de cualquier usuario
    if (req.usuario.rol !== 'admin' && req.usuario.id !== parseInt(usuario_id)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tienes permiso para ver los trámites de otro usuario.'
      });
    }

    const solicitudes = await SolicitudTramite.findAll({
      where: { usuario_id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ ok: true, solicitudes });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el historial del usuario',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// PUT /api/tramites/:id — Actualizar estado del trámite
// Requiere: admin
// ══════════════════════════════════════════════════════════
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id }             = req.params;
    const { estado_tramite } = req.body;

    const solicitud = await SolicitudTramite.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
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
      mensaje: 'Error al actualizar',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// DELETE /api/tramites/:id — Eliminar solicitud
// Requiere: admin
// ══════════════════════════════════════════════════════════
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id }       = req.params;
    const filasBorradas = await SolicitudTramite.destroy({ where: { id } });

    if (filasBorradas === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    res.status(200).json({ ok: true, mensaje: 'Solicitud eliminada correctamente' });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar',
      error: error.message
    });
  }
});

module.exports = router;