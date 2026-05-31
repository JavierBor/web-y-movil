// backend/src/routes/tramitesRoutes.js
const express = require('express');
const router  = express.Router();
const SolicitudTramite = require('../models/SolicitudTramite');
const Usuario = require('../models/Usuario'); // 🔌 IMPORTACIÓN OBLIGATORIA para el include/JOIN
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// ══════════════════════════════════════════════════════════
// POST /api/tramites — Crear nueva solicitud (Pago o Cita)
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
        estado_tramite: ['Pendiente']
      }
    });

    if (solicitudActiva) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Ya cuentas con una solicitud activa para este trámite. No puedes agendar otra hasta que la actual finalice.'
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
    console.error('Error crítico en POST /tramites:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al procesar la solicitud',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// GET /api/tramites — Obtener todas las solicitudes municipales
// Requiere: admin (Unificada y con el JOIN relacional para el RUT)
// ══════════════════════════════════════════════════════════
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    // 🟢 Ejecuta una consulta única segura con verificación de token y JOIN de Usuario
    const solicitudes = await SolicitudTramite.findAll({
      include: [{
        model: Usuario, // 🔌 Obliga a Sequelize a inyectar la relación en Postgres
        attributes: ['rut', 'nombre_usuario', 'correo'] // Extrae sólo los datos requeridos
      }],
      order: [['createdAt', 'DESC']] // Ordena cronológicamente descendente
    });

    res.status(200).json({ ok: true, solicitudes });
  } catch (error) {
    console.error("Error al obtener trámites para administración:", error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener las solicitudes',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// GET /api/tramites/usuario/:usuario_id — Solicitudes del usuario
// CUMPLE REQUISITO: EP 2.3 (Endpoints) y EP 2.4 (Mapeo Relacional)
// ══════════════════════════════════════════════════════════
router.get('/usuario/:usuario_id', verificarToken, async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const Tramite = require('../models/Tramite'); // 🔌 Importación local segura del modelo catálogo

    // Control de seguridad por Token JWT: Un contribuyente común solo audita sus propias filas
    if (req.usuario.rol !== 'admin' && req.usuario.id !== parseInt(usuario_id)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tienes permiso para verificar registros de otros contribuyentes.'
      });
    }

    // Buscamos las solicitudes del usuario e INCLUIMOS el trámite base de la tabla catálogo
    const solicitudes = await SolicitudTramite.findAll({
      where: { usuario_id },
      include: [{
        model: Tramite, // 🚀 JOIN relacional para heredar 'nombre_tramite' y 'requiere_documentos'
        attributes: ['nombre_tramite', 'requiere_documentos']
      }],
      order: [['createdAt', 'DESC']] // Las actualizaciones más recientes primero
    });

    res.status(200).json({ ok: true, solicitudes });
  } catch (error) {
    console.error('Error al compilar buzón relacional del usuario:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al procesar el buzón del usuario',
      error: error.message
    });
  }
});

// ══════════════════════════════════════════════════════════
// PUT /api/tramites/:id — Actualizar estado del trámite o JSONB
// Requiere: admin
// ══════════════════════════════════════════════════════════
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_tramite, datos_extra } = req.body; // 🔌 Recibe datos_extra desde el frontend

    const solicitud = await SolicitudTramite.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    if (estado_tramite) solicitud.estado_tramite = estado_tramite;
    
    if (datos_extra) {
      solicitud.datos_extra = datos_extra;
      // 🚨 Candado de Sequelize: Avisa a Postgres que el JSONB interno fue alterado
      solicitud.changed('datos_extra', true); 
    }

    await solicitud.save();

    res.status(200).json({
      ok: true,
      mensaje: 'Trámite actualizado exitosamente en el servidor.',
      solicitud
    });
  } catch (error) {
    console.error('Error al actualizar trámite:', error);
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
    const { id } = req.params;
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