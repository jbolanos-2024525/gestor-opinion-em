const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Tu nombre no puede quedar vacío'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede superar los 50 caracteres'],
    },
    username: {
      type: String,
      required: [true, 'Necesitas un nombre de usuario para continuar'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
      maxlength: [30, 'El nombre de usuario no puede superar los 30 caracteres'],
      match: [/^[a-zA-Z0-9_]+$/, 'Tu nombre de usuario solo admite letras, números y guión bajo'],
    },
    correo: {
      type: String,
      required: [true, 'Necesitamos un correo para crear tu cuenta'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo que ingresaste no es válido'],
    },
    password: {
      type: String,
      required: [true, 'Crea una contraseña para proteger tu cuenta'],
      minlength: [6, 'Usa al menos 6 caracteres en tu contraseña'],
      select: false,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [200, 'La biografía no puede superar los 200 caracteres'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema);