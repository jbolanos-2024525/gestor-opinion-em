    const express = require('express');
    const router = express.Router();

    const { registro, login, obtenerPerfil, actualizarPerfil, cambiarPassword } = require('./auth.controller');
    const { protegerRuta } = require('../../middlewares/auth.middleware');
    const { manejarValidaciones } = require('../../middlewares/error.middleware');
    const { validarRegistro, validarLogin, validarActualizarPerfil, validarCambiarPassword } = require('../validators/auth.validator');

    // Rutas públicas
    router.post('/registro', validarRegistro, manejarValidaciones, registro); 
    router.post('/login', validarLogin, manejarValidaciones, login);

    // Rutas protegidas
    router.get('/perfil', protegerRuta, obtenerPerfil);
    router.put('/perfil', protegerRuta, validarActualizarPerfil, manejarValidaciones, actualizarPerfil);
    router.put('/cambiar-password', protegerRuta, validarCambiarPassword, manejarValidaciones, cambiarPassword);

    module.exports = router;
