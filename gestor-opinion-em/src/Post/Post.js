const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [150, 'El título no puede superar 150 caracteres'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es requerida'],
      trim: true,
      enum: {
        values: ['Tecnología', 'Política', 'Deportes', 'Entretenimiento', 'Ciencia', 'Educación', 'Salud', 'General'],
        message: 'Categoría inválida. Opciones: Tecnología, Política, Deportes, Entretenimiento, Ciencia, Educación, Salud, General',
      },
    },
    texto: {
      type: String,
      required: [true, 'El texto principal es requerido'],
      trim: true,
      minlength: [10, 'El texto debe tener al menos 10 caracteres'],
      maxlength: [5000, 'El texto no puede superar 5000 caracteres'],
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
