/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

//Guardamos la conexion con la base de datos en una variable
const getDB = require('../../db/getDB');

// Creamos la funcion listas noticias
const listUserNews = async (req, res, next) => {
    let connection;

    try {
        //Creamos la conexion con la base de datos
        connection = await getDB();

        // Recuperamos el id del usuario que ha iniciado sesion
        const idUserAuth = req.userAuth.id;

        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [news] = await connection.query(
            `SELECT * FROM news WHERE idUser = ?`,
            [idUserAuth]
        );

        // Respondemos con las noticias del usuario
        res.send({
            status: 'Ok',
            message: '¡Lista de Noticias!',
            news: news,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

//Exportamos la funcion
module.exports = listUserNews;
