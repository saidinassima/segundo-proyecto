//Controlador para editar la contraseña de usuario
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');
const getDB = require('../../db/getDB');
let saltRounds = 1;

const editUserPass = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        // Recuperamos la contraseña
        const idUserAuth = req.userAuth.id;
        // Recuperamos del req.body los datos necesarios
        const { email, newPass, confirmNewPass } = req.body;
        if (!email || !newPass || !confirmNewPass) {
            throw generateError('Faltan datos obligatorios', 400);
        }
        // Comprobamos que la nueva contraseña es igual a la confirmación de la misma
        if (newPass !== confirmNewPass) {
            throw generateError('Las contraseñas no coinciden', 401);
        }
        // Recuperamos el email del usuario logueado para comprobar que es el mismo que nos indican
        const [user] = await connection.query(
            `SELECT email FROM user WHERE id = ?`,
            [idUserAuth]
        );
        // Si ese email no coincide con el que recibimos en el req.body lanzamos un error
        if (email !== user[0].email) {
            throw generateError(
                'El email debe coincidir con el usuario que ha hecho login',
                401
            );
        }
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPass, saltRounds);
        await connection.query(`UPDATE user SET password = ? WHERE id = ?`, [
            hashedPassword,
            idUserAuth,
        ]);
        res.send({
            status: 'ok',
            message: '¡Contraseña actualizada con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = editUserPass;
