/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

//Guardamos la conexion con la base de datos en una variable
const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const idNewsSchema = require('../../schemas/idNewsSchema');

// Creamos la funcion listas noticias
const getNewById = async (req, res, next) => {
    let connection;

    try {
        //Creamos la conexion con la base de datos
        connection = await getDB();

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de idNewsSchema
        await validateSchema(idNewsSchema, req.params);

        const { idNews } = req.params;

        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [[selectedNew]] = await connection.query(
            `SELECT n.*,COUNT(l.id) likes ,COUNT(u.id) dislikes FROM news n LEFT JOIN user_like_news l ON n.id=l.idNews LEFT JOIN user_unlike_news u ON n.id=u.idNews WHERE n.id = ?`,
            [idNews]
        );

        if (!selectedNew.id) {
            throw generateError('La noticia no existe', 404);
        }

        // Respondemos con las noticias del usuario
        res.send({
            status: 'Ok',
            message: `¡Noticia con id ${idNews}!`,
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
