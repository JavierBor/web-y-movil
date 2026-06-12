// backend/src/routes/tramitesRoutes.js
const express = require('express');
const router  = express.Router();
const multer  = require('multer'); // 📦 Importamos Multer para procesar formularios multipart/form-data
const path    = require('path');
const fs      = require('fs');
const SolicitudTramite = require('../models/SolicitudTramite');
const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');

// 🛡️ EF 3: Importación ÚNICA de los middlewares de seguridad
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// 📧 EF 5: Configurar el transportador con tus variables seguras del archivo .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MUNICIPALIDAD_EMAIL,
    pass: process.env.MUNICIPALIDAD_PASSWORD
  }
});

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
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Candado de seguridad (EF 3): Máximo 5MB por cada archivo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos en formato PDF o imágenes (JPG, PNG)'));
  }
});

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
// ══════════════════════════════════════════════════════════
router.post('/', verificarToken, cargarDocumentos, async (req, res) => {
  try {
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

    const urlsMapeadas = {};
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        const archivoProcesado = req.files[key][0];
        urlsMapeadas[key] = `http://localhost:3000/uploads/${archivoProcesado.filename}`;
      });
    }

    const documentosResultantes = JSON.stringify(urlsMapeadas);

    const nuevaSolicitud = await SolicitudTramite.create({
      documentos_url: documentosResultantes,
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
// GET /api/tramites — Obtener todas las solicitudes municipales (Admin)
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
// ══════════════════════════════════════════════════════════
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_tramite, datos_extra, fecha_cita, hora_cita } = req.body; 

    const solicitud = await SolicitudTramite.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    console.log('-> ID Solicitud en BD:', solicitud.usuario_id, '|| ID Usuario en Token:', req.usuario.id);

    if (req.usuario.rol !== 'admin' && Number(solicitud.usuario_id) !== Number(req.usuario.id)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tienes los permisos requeridos para modificar esta solicitud.'
      });
    }

    if (estado_tramite) {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ ok: false, mensaje: 'Acción exclusiva para administradores municipales.' });
      }
      solicitud.estado_tramite = estado_tramite;
    }
    
    if (fecha_cita) solicitud.fecha_cita = fecha_cita;
    if (hora_cita) solicitud.hora_cita = hora_cita;

    if (datos_extra) {
      solicitud.datos_extra = datos_extra;
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
// DELETE /api/tramites/:id — Eliminar solicitud (Admin)
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

// ══════════════════════════════════════════════════════════
// POST /api/tramites/enviar-aviso — Adaptado a las variables del Frontend
// ══════════════════════════════════════════════════════════
router.post('/enviar-aviso', verificarToken, verificarAdmin, async (req, res) => {
  // 🛠️ Cambiamos los nombres para que coincidan con lo que escupe tu consola de Ionic:
  const { recipient, subject, message } = req.body;

  // Validación de seguridad preventiva en el servidor
  if (!recipient || !subject || !message) {
    return res.status(400).json({ error: 'Todos los campos (recipient, subject, message) son requeridos por el backend.' });
  }

  const mailOptions = {
    from: `"Municipalidad de Santo Domingo" <${process.env.MUNICIPALIDAD_EMAIL}>`,
    to: recipient, // <- Usamos recipient
    subject: `Notificación Municipal: ${subject}`, // <- Usamos subject
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-top: 0;">
          Municipalidad de Santo Domingo
        </h2>
        <p style="font-size: 16px; color: #333;">Estimado(a) vecino(a),</p>
        <p style="font-size: 15px; color: #444; line-height: 1.6; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0066cc; border-radius: 4px;">
          ${message} 
        </p>
        <br />
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <small style="color: #999; display: block; text-align: center;">Este es un correo automático del sistema de atención digital. Por favor no respondas a este mensaje.</small>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, msg: 'Correo enviado con éxito.' });
  } catch (error) {
    console.error('Error crítico de Nodemailer en el servidor:', error);
    res.status(500).json({ error: 'El servidor de Google rechazó el despacho del correo.' });
  }
});

module.exports = router;