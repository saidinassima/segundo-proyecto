const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const editUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        // Guardamos el id del usuario que ha iniciado sesion
        const idUserAuth = req.userAuth.id;
        // Recuperamos el nuevo email y nombre de usuario del cuerpo de la petición
        const { newEmail, newUsername } = req.body;
        // Si no existen ni el nuevo email ni el nuevo username
        if (!newEmail && !newUsername) {
            throw generateError(
                `¡Si no vas a modificar nada para que tocas!`,
                400
            );
        }
        // Comprobamos que le nuevo email no existe en la base de datos
        const [user] = await connection.query(
            `SELECT * FROM user WHERE email = ? OR username = ?`,
            [newEmail, newUsername]
        );
        if (user.length > 0) {
            throw generateError(
                'El nuevo email o nuevo username ya están en uso.',
                409
            );
        }
        // Modificamos el email y username de usuario
        // Seleccionamos los datos antiguos del usuario que ha iniciado seisión
        const [userAuth] = await connection.query(
            `SELECT email, username FROM user WHERE id = ?`,
            [idUserAuth]
        );
        // Modificamos los datos
        await connection.query(
            `UPDATE user SET email = ?, username = ? WHERE id = ?`,
            [
                newEmail || userAuth[0].email,
                newUsername || userAuth[0].username,
                idUserAuth,
            ]
        );
        res.send({
            status: 'ok',
            message: `¡Datos del usuario modificados con éxito!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = editUser;
