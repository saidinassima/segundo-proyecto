const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const bcrypt = require('bcrypt');
const delPassSchema = require('../../schemas/DelPassSchema');

const deleteUser = async (req, res, next) => {
    let connection;
    try {
        // Abrimos una conexión con la base de datos
        connection = await getDB();

        // Recuperamos la contraseña
        const idUserAuth = req.userAuth.id;

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de usersSchema
        await validateSchema(delPassSchema, req.body);

        // Recuperamos la contraseña del req.bocy
        const { password } = req.body;

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
