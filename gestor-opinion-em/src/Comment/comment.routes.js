const express = require('express');
const router = express.Router();

const { editarComentario, eliminarComentario } = require('./comment.controller');
const { protegerRuta } = require('../../middlewares/auth.middleware');
const { manejarValidaciones } = require('../../middlewares/error.middleware');
const { validarComentario } = require('../validators/comment.validator');

router.put('/:id', protegerRuta, validarComentario, manejarValidaciones, editarComentario);
router.delete('/:id', protegerRuta, eliminarComentario);

module.exports = router;
