const jwt = require('jsonwebtoken');
const User = require('./User');
const { crearError } = require('../../middlewares/error.middleware');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registro = async (req, res, next) => {
  try {
    const { nombre, username, correo, password, bio } = req.body;

    const usuario = await User.create({ nombre, username, correo, password, bio });

    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      message: 'Tu cuenta fue creada exitosamente, bienvenido.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        correo: usuario.correo,
        bio: usuario.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identificador, password } = req.body;

    const usuario = await User.findOne({
      $or: [
        { correo: identificador.toLowerCase() },
        { username: identificador.toLowerCase() },
      ],
    }).select('+password');

    if (!usuario) {
      return next(crearError('El correo, username o contraseña son incorrectos.', 401));
    }

    const passwordCorrecta = await usuario.compararPassword(password);
    if (!passwordCorrecta) {
      return next(crearError('El correo, username o contraseña son incorrectos.', 401));
    }

    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      message: 'Bienvenido de vuelta.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        correo: usuario.correo,
        bio: usuario.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

const obtenerPerfil = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        username: req.usuario.username,
        correo: req.usuario.correo,
        bio: req.usuario.bio,
        creadoEn: req.usuario.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, username, bio } = req.body;

    const camposActualizar = {};
    if (nombre) camposActualizar.nombre = nombre;
    if (username) camposActualizar.username = username;
    if (bio !== undefined) camposActualizar.bio = bio;

    const usuario = await User.findByIdAndUpdate(
      req.usuario._id,
      camposActualizar,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Los cambios en tu perfil fueron guardados.',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        correo: usuario.correo,
        bio: usuario.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

const cambiarPassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    const usuario = await User.findById(req.usuario._id).select('+password');

    const passwordCorrecta = await usuario.compararPassword(passwordActual);
    if (!passwordCorrecta) {
      return next(crearError('La contraseña que ingresaste no coincide con la actual.', 401));
    }

    usuario.password = passwordNueva;
    await usuario.save();

    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      message: 'Tu contraseña fue actualizada correctamente.',
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registro, login, obtenerPerfil, actualizarPerfil, cambiarPassword };