// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_municipalidad_santo_domingo_2026';

/**
 * verificarToken
 * Extrae y valida el JWT del header Authorization: Bearer <token>
 * Si es válido, añade req.usuario = { id, rol } para los controladores
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token no proporcionado o formato inválido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // { id, rol, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token expirado. Por favor inicie sesión nuevamente.'
      });
    }
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido'
    });
  }
};

/**
 * verificarAdmin
 * Usar DESPUÉS de verificarToken.
 * Solo permite continuar si req.usuario.rol === 'admin'
 */
const verificarAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({
      ok: false,
      mensaje: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin };