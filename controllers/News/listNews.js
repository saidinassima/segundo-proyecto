/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

//Guardamos la conexion con la base de datos en una variable
const getDB = require('../../db/getDB');
const { validateSchema } = require('../../helpers');
const filterThemeSchema = require('../../schemas/filterThemeSchema');

// Creamos la funcion listas noticias
const listNews = async (req, res, next) => {
    let connection;

    try {
        //Creamos la conexion con la base de datos
        connection = await getDB();

        let sqlQuery = `SELECT n.*,COUNT( DISTINCT l.id) likes ,COUNT( DISTINCT u.id) dislikes FROM news n LEFT JOIN user_like_news l ON n.id=l.idNews LEFT JOIN user_unlike_news u ON n.id=u.idNews`;

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de newsSchema
        await validateSchema(filterThemeSchema, req.query);

        // Obtenemos los campos necesarios del req.body
        const { theme } = req.query;

        if (theme) {
            // Recuperamos los datos de las noticias guardadas en la base de datos
            sqlQuery += ' WHERE theme = ?';
        }

        sqlQuery += ' GROUP BY n.id';

        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [news] = await connection.query(sqlQuery, [theme]);

        // Respondemos con las noticias del usuario
        res.send({
            status: 'Ok',
            message: '¡Lista de Noticias!',
            data: news,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

//Exportamos la funcion
module.exports = listNews;
