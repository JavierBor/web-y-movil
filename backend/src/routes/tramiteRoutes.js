// backend/src/routes/tramitesRoutes.js
const express = require('express');
const router  = express.Router();
const multer  = require('multer'); // 📦 Importamos Multer para procesar formularios multipart/form-data
const path    = require('path');
const fs      = require('fs');
const SolicitudTramite = require('../models/SolicitudTramite');
const Usuario = require('../models/Usuario');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// ══════════════════════════════════════════════════════════
// CONFIGURACIÓN DE ALMACENAMIENTO DE ARCHIVOS (LOCAL)
// ══════════════════════════════════════════════════════════
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir); // Crea automáticamente la carpeta 'uploads' si no existe en el raíz del backend
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Cambia el nombre para evitar colisiones. Ejemplo: cedula-164829312.pdf
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Candado de seguridad (EF 3): Máximo 5MB por cada archivo
  fileFilter: (req, file, cb) => {
    // Solo permitimos archivos PDF o imágenes comunes
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos en formato PDF o imágenes (JPG, PNG)'));
  }
});

// Definimos los campos exactos que configuramos en SubirDocumentos.tsx de Ionic
const cargarDocumentos = upload.fields([
  { name: 'cedula', maxCount: 1 },
  { name: 'hojaVida', maxCount: 1 },
  { name: 'certificadoEstudios', maxCount: 1 },
  { name: 'antecedentes', maxCount: 1 },
  { name: 'residencia', maxCount: 1 },
  { name: 'examenesMedicos', maxCount: 1 }
]);

// ══════════════════════════════════════════════════════════
// POST /api/tramites — Crear nueva solicitud (Paso 1: Carga de Papeles)
// Requiere: usuario autenticado
// ══════════════════════════════════════════════════════════
router.post('/', verificarToken, cargarDocumentos, async (req, res) => {
  try {
    // Multer procesa el FormData multipart y deposita las cadenas de texto en req.body
    const {
      fecha_cita,
      hora_cita,
      comprobante_url,
      usuario_id,
      sucursal_id,
      tramite_id,
      datos_extra,
      tipo_tramite
    } = req.body;

    // Verificar que no haya una solicitud activa pendiente para este trámite
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

    // 📂 PROCESAMIENTO DINÁMICO DE ARCHIVOS SUBIDOS
    const urlsMapeadas = {};
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        const archivoProcesado = req.files[key][0];
        // Construimos la URL pública apuntando a nuestro servidorExpress
        urlsMapeadas[key] = `http://localhost:3000/uploads/${archivoProcesado.filename}`;
      });
    }

    // Convertimos el mapa de URLs resultantes a un String JSON para salvarlo en la columna TEXT de Postgres
    const documentosResultantes = JSON.stringify(urlsMapeadas);

    const nuevaSolicitud = await SolicitudTramite.create({
      documentos_url: documentosResultantes, // Guardamos todas las rutas estructuradas
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
      mensaje: 'Solicitud de trámite ingresada correctamente junto con sus documentos.',
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
// Requiere: admin (Con include relacional seguro para pgAdmin)
// ══════════════════════════════════════════════════════════
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const solicitudes = await SolicitudTramite.findAll({
      include: [{
        model: Usuario, 
        attributes: ['rut', 'nombre_usuario', 'correo'] 
      }],
      order: [['createdAt', 'DESC']] 
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
// Requiere: usuario autenticado, y solo puede ver las suyas
// ══════════════════════════════════════════════════════════
router.get('/usuario/:usuario_id', verificarToken, async (req, res) => {
  try {
    const { usuario_id } = req.params;

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
// PUT /api/tramites/:id — Actualizar estado (Admin) o Agendar Cita (Ciudadano)
// Requiere: token de usuario activo
// ══════════════════════════════════════════════════════════
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_tramite, datos_extra, fecha_cita, hora_cita } = req.body; 

    const solicitud = await SolicitudTramite.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    // 🔍 CONTROL EN TERMINAL: Permite auditar en tiempo real la consistencia de tipos
    console.log('-> ID Solicitud en BD:', solicitud.usuario_id, '|| ID Usuario en Token:', req.usuario.id);

    // 🛡️ REGLA DE PRIVACIDAD (EF 3): Un ciudadano común SOLO puede alterar su propia solicitud.
    // Usamos Number() para romper la falla estricta por si el id del token viaja como String.
    if (req.usuario.rol !== 'admin' && Number(solicitud.usuario_id) !== Number(req.usuario.id)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tienes los permisos requeridos para modificar esta solicitud.'
      });
    }

    // 🔒 CANDADO DE ROL: Si viene un cambio de estado, verificamos estrictamente que sea Administrador
    if (estado_tramite) {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ ok: false, mensaje: 'Acción exclusiva para administradores municipales.' });
      }
      solicitud.estado_tramite = estado_tramite;
    }
    
    // Inyectamos los campos de la cita (Paso 2 del ciudadano en Ionic desde el calendario)
    if (fecha_cita) solicitud.fecha_cita = fecha_cita;
    if (hora_cita) solicitud.hora_cita = hora_cita;

    if (datos_extra) {
      solicitud.datos_extra = datos_extra;
      // Candado de Sequelize para bases JSONB en Postgres
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