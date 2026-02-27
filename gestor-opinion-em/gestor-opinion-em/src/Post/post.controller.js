const Post = require('./Post');
const Comment = require('../Comment/Comment');
const { crearError } = require('../../middlewares/error.middleware');

const crearPublicacion = async (req, res, next) => {
  try {
    const { titulo, categoria, texto } = req.body;

    const publicacion = await Post.create({
      titulo,
      categoria,
      texto,
      autor: req.usuario._id,
    });

    await publicacion.populate('autor', 'nombre username');

    res.status(201).json({
      success: true,
      message: 'Tu publicación ya está visible para todos.',
      publicacion,
    });
  } catch (error) {
    next(error);
  }
};

const listarPublicaciones = async (req, res, next) => {
  try {
    const { categoria, page = 1, limit = 10 } = req.query;
    const filtro = {};
    if (categoria) filtro.categoria = categoria;

    const skip = (page - 1) * limit;
    const total = await Post.countDocuments(filtro);

    const publicaciones = await Post.find(filtro)
      .populate('autor', 'nombre username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pagina: Number(page),
      totalPaginas: Math.ceil(total / limit),
      publicaciones,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerPublicacion = async (req, res, next) => {
  try {
    const publicacion = await Post.findById(req.params.id).populate('autor', 'nombre username');

    if (!publicacion) {
      return next(crearError('Esta publicación no existe o fue eliminada.', 404));
    }

    res.status(200).json({
      success: true,
      publicacion,
    });
  } catch (error) {
    next(error);
  }
};

const editarPublicacion = async (req, res, next) => {
  try {
    const publicacion = await Post.findById(req.params.id);

    if (!publicacion) {
      return next(crearError('Esta publicación no existe o fue eliminada.', 404));
    }

    if (publicacion.autor.toString() !== req.usuario._id.toString()) {
      return next(crearError('Solo puedes editar tus propias publicaciones.', 403));
    }

    const { titulo, categoria, texto } = req.body;
    const camposActualizar = {};
    if (titulo) camposActualizar.titulo = titulo;
    if (categoria) camposActualizar.categoria = categoria;
    if (texto) camposActualizar.texto = texto;

    const publicacionActualizada = await Post.findByIdAndUpdate(
      req.params.id,
      camposActualizar,
      { new: true, runValidators: true }
    ).populate('autor', 'nombre username');

    res.status(200).json({
      success: true,
      message: 'Los cambios en tu publicación fueron guardados.',
      publicacion: publicacionActualizada,
    });
  } catch (error) {
    next(error);
  }
};

const eliminarPublicacion = async (req, res, next) => {
  try {
    const publicacion = await Post.findById(req.params.id);

    if (!publicacion) {
      return next(crearError('Esta publicación no existe o ya fue eliminada.', 404));
    }

    if (publicacion.autor.toString() !== req.usuario._id.toString()) {
      return next(crearError('Solo puedes eliminar tus propias publicaciones.', 403));
    }

    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ publicacion: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Tu publicación y sus comentarios fueron eliminados.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { crearPublicacion, listarPublicaciones, obtenerPublicacion, editarPublicacion, eliminarPublicacion };