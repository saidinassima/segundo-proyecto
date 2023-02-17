/* 
    Middleware que comprobará si el usuario ha iniciado sesión o no
*/

const getDB = require('../db/getDB');
const { generateError, validateSchema } = require('../helpers');
const jwt = require('jsonwebtoken');
const authSchema = require('../schemas/AuthSchema');
const { type } = require('../schemas/AuthSchema');
require('dotenv').config(); // dependencia necesaria para leer la variable de entorno SECRET

const isAuth = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de authSchema
        validateSchema(authSchema, req.headers);

        // Recuperar la cabecera de autorización
        const { authorization } = req.headers;

        // Si no existe la cabecera de autorizacion
        if (!authorization) {
            throw generateError('¡Falta la cabecera de autorización!', 401); // Unauthorized
        }

        // Variable que va a guardar la info del token
        let tokenInfo;

        try {
            // Desencriptamos el token
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            throw generateError('¡El token no es válido!', 401); // Unauthorized
        }

        // Comprobamos que el id del usuario del token existe en la base de datos
        const [user] = await connection.query(
            `SELECT * FROM user WHERE id = ?`,
            [tokenInfo.id]
        );

        // Si se ha eliminado el usuario
        if (user.length < 1) {
            throw generateError('¡El token no es válido!', 401); // Unauthorized
        }

        // Guardamos una propiedad nueva en el objeto req con la info del token
        // el id del usuario que ha iniciado sesión
        req.userAuth = tokenInfo;

        // Si todo va bien, pasamos la pelota
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = isAuth;
