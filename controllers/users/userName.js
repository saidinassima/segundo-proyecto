const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userName = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una conexión con la base de datos
        connection = await getDB();

        // Recuperamos la contraseña
        const idUserAuth = req.userAuth.id;

        // Comprobamos que existe un usuario con ese email en la base de datos y está activo
        const [username] = await connection.query(
            `SELECT username FROM user WHERE id = ?`,
            [idUserAuth]
        );

        // Si no se puede obtener el nombre sacamo un error
        if (username.length <= 0) {
            throw generateError('Nombre de usuario no encontrado', 409);
        }

        // Si ha ido todo bien hasta aqui, respondemos con el nombre obtenido
        res.send({
            status: 'Ok',
            data: { userName: username },
        });
    } catch (error) {
        // En caso de que ocurra algun error lo pasamos
        next(error);
    } finally {
        // Finalmente, cerramos la conexion con la bbdd
        if (connection) connection.release();
    }
};

// Exportamos la funcion
module.exports = userName;
