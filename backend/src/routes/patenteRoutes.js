const express = require('express');
const router = express.Router();
const SolicitudPatente = require('../models/SolicitudPatente');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = './uploads/patentes/';
        // Clasificar por tipo de documento
        if (file.fieldname === 'rut_documento') {
            dir += 'rut/';
        } else if (file.fieldname === 'patente_anterior') {
            dir += 'patentes_anteriores/';
        } else if (file.fieldname === 'certificado_dgi') {
            dir += 'certificados_dgi/';
        }
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'patente-' + file.fieldname + '-' + uniqueSuffix + extension);
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
// 1. POST: Crear solicitud de Patente Municipal
// ==========================================
router.post('/', upload.fields([
    { name: 'rut_documento', maxCount: 1 },
    { name: 'patente_anterior', maxCount: 1 },
    { name: 'certificado_dgi', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            nombre_negocio,
            rubro,
            direccion_comercial,
            tipo_patente,
            usuario_id,
            sucursal_id
        } = req.body;

        // Validaciones
        if (!nombre_negocio || !rubro || !direccion_comercial || !tipo_patente || !usuario_id || !sucursal_id) {
            return res.status(400).json({
                ok: false,
                mensaje: "Faltan campos requeridos: nombre_negocio, rubro, direccion_comercial, tipo_patente, usuario_id, sucursal_id"
            });
        }

        // Crear URLs de los documentos subidos
        const files = req.files;
        const solicitudData = {
            nombre_negocio,
            rubro,
            direccion_comercial,
            tipo_patente,
            usuario_id,
            sucursal_id,
            rut_documento_url: files.rut_documento ? files.rut_documento[0].path : null,
            patente_anterior_url: files.patente_anterior ? files.patente_anterior[0].path : null,
            certificado_dgi_url: files.certificado_dgi ? files.certificado_dgi[0].path : null,
            estado: 'Pendiente'
        };

        const nuevaSolicitud = await SolicitudPatente.create(solicitudData);

        res.status(201).json({
            ok: true,
            mensaje: "Solicitud de Patente Municipal enviada correctamente",
            solicitud: {
                id: nuevaSolicitud.id,
                nombre_negocio: nuevaSolicitud.nombre_negocio,
                estado: nuevaSolicitud.estado,
                created_at: nuevaSolicitud.createdAt
            }
        });

    } catch (error) {
        console.error('Error al crear solicitud de patente:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al enviar la solicitud de patente",
            error: error.message
        });
    }
});

// ==========================================
// 2. GET: Obtener todas las solicitudes (Admin)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const solicitudes = await SolicitudPatente.findAll({
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
        const solicitudes = await SolicitudPatente.findAll({
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
        const solicitud = await SolicitudPatente.findByPk(id);
        
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
        const { estado, observaciones } = req.body;
        
        const solicitud = await SolicitudPatente.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        solicitud.estado = estado;
        if (observaciones) solicitud.observaciones = observaciones;
        
        // Registrar fechas importantes según el estado
        if (estado === 'En Revisión' && !solicitud.fecha_revision) {
            solicitud.fecha_revision = new Date();
        }
        if (estado === 'Aprobada') {
            solicitud.fecha_aprobacion = new Date();
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
        const solicitud = await SolicitudPatente.findByPk(id);
        
        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                mensaje: "Solicitud no encontrada"
            });
        }

        // Opcional: Eliminar archivos asociados
        // Aquí podrías agregar lógica para eliminar los archivos del servidor
        
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