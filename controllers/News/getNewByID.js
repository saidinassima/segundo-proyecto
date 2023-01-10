/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

//Guardamos la conexion con la base de datos en una variable
const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

// Creamos la funcion listas noticias
const getNewById = async (req, res, next) => {
    let connection;

    try {
        //Creamos la conexion con la base de datos
        connection = await getDB();

        const { idNew } = req.params;

        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [[selectedNew]] = await connection.query(
            `SELECT n.*,COUNT(l.id) likes ,COUNT(u.id) dislikes FROM news n LEFT JOIN user_like_news l ON n.id=l.idNews LEFT JOIN user_unlike_news u ON n.id=u.idNews WHERE n.id = ?`,
            [idNew]
        );

        if (!selectedNew.id) {
            throw generateError('La noticia no existe', 404);
        }

        // Respondemos con las noticias del usuario
        res.send({
            status: 'Ok',
            message: `¡Noticia con id ${idNew}!`,
            data: selectedNew,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

//Exportamos la funcion
module.exports = getNewById;
