const express = require('express');
const router = express.Router();
const SolicitudBeca = require('../models/SolicitudBeca');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = './uploads/becas/';
        // Clasificar por tipo de documento
        if (file.fieldname === 'certificado_alumno') {
            dir += 'certificados_alumno/';
        } else if (file.fieldname === 'concentracion_notas') {
            dir += 'concentracion_notas/';
        } else if (file.fieldname === 'certificado_renta') {
            dir += 'certificados_renta/';
        } else if (file.fieldname === 'fotocopia_cedula') {
            dir += 'cedulas/';
        }
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'beca-' + file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo JPEG, PNG, JPG o PDF'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite 5MB
});

// ==========================================
// 1. POST: Crear solicitud de Beca Municipal
// ==========================================
router.post('/', upload.fields([
    { name: 'certificado_alumno', maxCount: 1 },
    { name: 'concentracion_notas', maxCount: 1 },
    { name: 'certificado_renta', maxCount: 1 },
    { name: 'fotocopia_cedula', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            nombre_estudiante,
            rut_estudiante,
            institucion,
            carrera,
            nivel_estudio,
            ingreso_familiar,
            usuario_id,
            sucursal_id
        } = req.body;

        // Validaciones
        if (!nombre_estudiante || !rut_estudiante || !institucion || !carrera || 
            !nivel_estudio || !ingreso_familiar || !usuario_id || !sucursal_id) {
            return res.status(400).json({
                ok: false,
                mensaje: "Faltan campos requeridos"
            });
        }

        // Crear URLs de los documentos subidos
        const files = req.files;
        const solicitudData = {
            nombre_estudiante,
            rut_estudiante,
            institucion,
            carrera,
            nivel_estudio,
            ingreso_familiar,
            usuario_id,
            sucursal_id,
            certificado_alumno_url: files.certificado_alumno ? files.certificado_alumno[0].path : null,
            concentracion_notas_url: files.concentracion_notas ? files.concentracion_notas[0].path : null,
            certificado_renta_url: files.certificado_renta ? files.certificado_renta[0].path : null,
            fotocopia_cedula_url: files.fotocopia_cedula ? files.fotocopia_cedula[0].path : null,
            estado: 'Pendiente'
        };

        const nuevaSolicitud = await SolicitudBeca.create(solicitudData);

        res.status(201).json({
            ok: true,
            mensaje: "Solicitud de Beca Municipal enviada correctamente",
            solicitud: {
                id: nuevaSolicitud.id,
                nombre_estudiante: nuevaSolicitud.nombre_estudiante,
                estado: nuevaSolicitud.estado,
                created_at: nuevaSolicitud.createdAt
            }
        });

    } catch (error) {
        console.error('Error al crear solicitud de beca:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al enviar la solicitud de beca",
            error: error.message
        });
    }
});

// ==========================================
// 2. GET: Obtener todas las solicitudes (Admin)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const solicitudes = await SolicitudBeca.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            ok: true,
            solicitudes
        });
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
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
        const solicitudes = await SolicitudBeca.findAll({
            where: { usuario_id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            ok: true,
            solicitudes
        });
    } catch (error) {
        console.error('Error al obtener solicitudes del usuario:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener las solicitudes del usuario",
            error: error.message
        });
    }
});

// ==========================================
// 4. GET: Obtener una solicitud específica
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await SolicitudBeca.findByPk(id);
        
        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        res.status(200).json({
            ok: true,
            solicitud
        });
    } catch (error) {
        console.error('Error al obtener solicitud:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener la solicitud",
            error: error.message
        });
    }
});

// ==========================================
// 5. PUT: Actualizar estado (Admin)
// ==========================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, observaciones, monto_asignado } = req.body;
        
        const solicitud = await SolicitudBeca.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        solicitud.estado = estado;
        if (observaciones) solicitud.observaciones = observaciones;
        if (monto_asignado) solicitud.monto_asignado = monto_asignado;
        
        // Registrar fechas importantes según el estado
        if (estado === 'En Revisión' && !solicitud.fecha_revision) {
            solicitud.fecha_revision = new Date();
        }
        if (estado === 'Aprobada' || estado === 'Rechazada') {
            solicitud.fecha_resolucion = new Date();
        }
        
        await solicitud.save();

        res.status(200).json({
            ok: true,
            mensaje: `Estado actualizado a: ${estado}`,
            solicitud
        });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al actualizar el estado",
            error: error.message
        });
    }
});

// ==========================================
// 6. DELETE: Eliminar solicitud
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await SolicitudBeca.findByPk(id);
        
        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        await solicitud.destroy();

        res.status(200).json({
            ok: true,
            mensaje: "Solicitud eliminada correctamente"
        });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al eliminar la solicitud",
            error: error.message
        });
    }
});

module.exports = router;