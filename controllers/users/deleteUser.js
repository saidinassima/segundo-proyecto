const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');
const deleteUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const idUserAuth = req.userAuth.id;
        // Recuperamos la contraseña del req.bocy
        const { password } = req.body;
        // Si no indica la contraseña lanzamos un error
        if (!password) {
            throw generateError(
                '¡Debes indicar la contraseña para eliminar el usuario!',
                400
            );
        }
        // Recuperamos la contraseña del usuario para hacer la comparación
        const [user] = await connection.query(
            `SELECT password FROM user WHERE id = ?`,
            [idUserAuth]
        );
        // Comparar las contraseñas
        const validPassword = await bcrypt.compare(password, user[0].password);
        // Si no coinciden las contraseñas
        if (!validPassword) {
            throw generateError('La contraseña no es váliida', 401);
        }
        await connection.query(`DELETE FROM user WHERE id = ?`, [idUserAuth]);
        res.send({
            status: 'ok',
            message: `¡Usuario con id ${idUserAuth} eliminado con éxito!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = deleteUser;
