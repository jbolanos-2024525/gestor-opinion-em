'use strict';

require('dotenv').config();
const express = require('express');
const { manejarErrores } = require('../middlewares/error.middleware');
const { connectDB } = require('../config/database');

const authRoutes = require('./Auth/auth.routes');
const postRoutes = require('./Post/post.routes');
const commentRoutes = require('./Comment/comment.routes');

const BASE_PATH = '/gestion-opiniones/api/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/auth`, authRoutes);
    app.use(`${BASE_PATH}/publicaciones`, postRoutes);
    app.use(`${BASE_PATH}/comentarios`, commentRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Gestion Opiniones Server'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });

    app.use(manejarErrores);
};

const middlewares = (app) => {
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
};

const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    try {
        middlewares(app);
        await connectDB();
        routes(app);

        app.listen(PORT, () => {
            console.log(`Gestion Opiniones corriendo en el puerto ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (err) {
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};

initServer();

module.exports = { initServer };