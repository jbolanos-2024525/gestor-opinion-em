const express = require('express');
const router = express.Router();

const { crearPublicacion, listarPublicaciones, obtenerPublicacion, editarPublicacion, eliminarPublicacion } = require('./post.controller');
const { crearComentario, listarComentarios } = require('../Comment/comment.controller');
const { protegerRuta } = require('../../middlewares/auth.middleware');
const { manejarValidaciones } = require('../../middlewares/error.middleware');
const { validarPublicacion } = require('../validators/post.validator');
const { validarComentario } = require('../validators/comment.validator');


router.get('/', listarPublicaciones);
router.get('/:id', obtenerPublicacion);
router.post('/', protegerRuta, validarPublicacion, manejarValidaciones, crearPublicacion);
router.put('/:id', protegerRuta, validarPublicacion, manejarValidaciones, editarPublicacion);
router.delete('/:id', protegerRuta, eliminarPublicacion);

// Comentarios anidados en publicaciones
router.get('/:postId/comentarios', listarComentarios);
router.post('/:postId/comentarios', protegerRuta, validarComentario, manejarValidaciones, crearComentario);

module.exports = router;
