/* 
    Archivo que crea y devuelve una conexión libre a la base de datos
*/

const mysql = require('mysql2/promise');
require('dotenv').config();

// Importamos las variables de entorno que hemos creado para la conexión
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

const getDB = async () => {
    // Declaramos un pool de conexiones
    let pool;

    try {
        if (!pool) {
            // Creamos un grupo de conexiones
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
                timezone: 'Z',
            });
            // Ejecutamos el método getConnection para devolver una conexion libre
            return await pool.getConnection();
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Exportamos la funcion getDB
module.exports = getDB;
