const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: [true, 'No puedes dejar un comentario en blanco'],
      trim: true,
      minlength: [1, 'El comentario necesita al menos un carácter'],
      maxlength: [1000, 'Tu comentario es demasiado largo, máximo 1000 caracteres'],
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', commentSchema);