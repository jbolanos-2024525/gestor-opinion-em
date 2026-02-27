const jwt = require('jsonwebtoken');
const User = require('../src/Auth/User');

const protegerRuta = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Necesitas iniciar sesión para acceder a esto.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await User.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Tu cuenta ya no existe, vuelve a registrarte.',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Tu sesión expiró, vuelve a iniciar sesión.',
    });
  }
};

module.exports = { protegerRuta };