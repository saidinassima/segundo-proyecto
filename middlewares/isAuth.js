/*
Middleware que comprobará si el usuario a iniciado sesión o no
*/

const getDB = require('../db/getDB');
const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Recuperar la cabecera de autorización
        const { authorization } = req.headers;

        // Si no existe la cabecera de autorizacion
        if (!authorization) {
            throw generateError('Falta la autorización', 401);
        }

        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            throw generateError('El token no es valido', 401);
        }

        // Comprobamos que el id del usuario token existe aún en la base de datos
        const [user] = await connection.query(
            `SELECT * FROM user WHERE id = ?`,
            [tokenInfo.id]
        );

        if (user.length < 1) {
            throw generateError('¡El token no es válido!', 401);
        }

        // Guardamos una propiedad nueva en el objeto req con la infodel token del id del usuario que ha iniciado sesión
        req.userAuth = tokenInfo.id;

        // Si todo va bien, pasamos a los siguiente
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = isAuth;
