/* 
    Controlador para el registro de un nuevo usuario
*/

const getDB = require('../../db/getDB');
const {
    generateError,
    generateRandomCode,
    validateSchema,
} = require('../../helpers');
const bcrypt = require('bcrypt');
const newUsersSchema = require('../../schemas/newusersSchema');

// Declaramos la variable que establecerá lo "complicada" que encriptará la contraseña
const saltRounds = 10;

const newUser = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una conexión a la base de datos
        connection = await getDB();

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de usersSchema
        await validateSchema(newUsersSchema, req.body);

        // Obtenemos los campos necesarios del req.body
        const { username, email, password } = req.body;

        // Comprobamos que el email o el username no esté ya en la base de datos
        const [userMail] = await connection.query(
            `SELECT id FROM user WHERE email = ?`,
            [email]
        );

        // Si la logitud de la variable usuario (array) es mayor de 0, el email ya existe
        if (userMail.length > 0) {
            // Si el email ya existe lanzamos un error
            throw generateError(
                'Ya existe un usuario con ese email en la base de datos',
                409
            ); // Conflict
        }

        // Comprobamos que el nombre de usuario no esté en la BBDD
        const [userName] = await connection.query(
            `SELECT id FROM user WHERE username = ?`,
            [username]
        );

        // Si la logitud de la variable usuario (array) es mayor de 0, el email ya existe
        if (userName.length > 0) {
            // Si el email ya existe lanzamos un error
            throw generateError(
                `${username} ya existe en la base de datos`,
                409
            ); // Conflict
        }

        // Usamos la dependencia bcrypt para encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generamos el codigo de registro aleatorio para el usuario
        const registrationCode = generateRandomCode(40);

        // Guardamos el nuevo usuario
        await connection.query(
            `INSERT INTO user (username, email, password)
            VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );

        // Enviamos la respuesta
        res.send({
            status: 'Ok',
            message: '¡Usuario registrado con éxito !',
        });
    } catch (error) {
        // En caso de que ocurra algun error, lo pasamos
        next(error);
    } finally {
        // Siempre, al final, cerramos la conexion con la BBDD
        if (connection) connection.release();
    }
};

// Exportamos la funcion
module.exports = newUser;
