const { validationResult } = require('express-validator');

const manejarValidaciones = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Revisa los campos e intenta de nuevo',
      errores: errors.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

const manejarErrores = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `El ${campo} que ingresaste ya está registrado, prueba con otro.`,
    });
  }

  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Algunos campos no son válidos',
      errores: mensajes,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'El recurso que buscas no existe.',
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Algo salió mal, intenta de nuevo más tarde.',
  });
};

const crearError = (mensaje, statusCode) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  return error;
};

module.exports = { manejarValidaciones, manejarErrores, crearError };