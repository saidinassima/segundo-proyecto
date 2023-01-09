/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

//Guardamos la conexion con la base de datos en una variable
const getDB = require('../../db/getDB');

// Creamos la funcion listas noticias
const listNews = async (req, res, next) => {
    let connection;

    try {
        //Creamos la conexion con la base de datos
        connection = await getDB();


        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [news] = await connection.query(
            `SELECT * FROM news`
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
module.exports = listNews;
