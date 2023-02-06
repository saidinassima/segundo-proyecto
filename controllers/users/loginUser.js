const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginUserSchema = require('../../schemas/loginUserSchema');
require('dotenv').config();

const loginUser = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una conexión con la base de datos
        connection = await getDB();

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de usersSchema
        await validateSchema(loginUserSchema, req.body);

        // Obtenemos los datos necesarios para el login
        const { email, password } = req.body;

        // Comprobamos que existe un usuario con ese email en la base de datos y está activo
        const [username] = await connection.query(
            `SELECT * FROM user WHERE email = ?`,
            [email]
        );

        // Comprobamos que la contraseña recibida es la correcta
        let validPassword;

        // Si hay algun usuario con el email, podemos obtener su contraseña
        if (username.length > 0) {
            validPassword = await bcrypt.compare(
                password,
                username[0].password
            );
        }

        // Si la contraseña no es válida o el email no es válido
        if (username.length < 1 || !validPassword) {
            throw generateError('Email o contraseña incorrectos.', 401); // Unauthorized
        }

        ///// Generamos el token

        // Objeto con información útil del usuario que guardaremos en el token
        const tokenInfo = {
            id: username[0].id,
        };

        // Creamos el token
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '10d',
        });

        // Si ha ido todo bien hasta aqui, respondemos con el token generado
        res.send({
            status: 'Ok',
            message: '¡Sesión iniciada con éxito!',
            authToken: token,
            token: tokenInfo,
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
module.exports = loginUser;
