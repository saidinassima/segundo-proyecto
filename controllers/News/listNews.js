/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

const jwt = require('jsonwebtoken');
const { token } = require('morgan');

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

        // const { authorization } = req.headers;

        // // Variable que va a guardar la info del token
        // let tokenInfo;

        // if (authorization) {
        //     // Desencriptamos el token
        //     tokenInfo = jwt.verify(authorization, process.env.SECRET);
        // }

        let sqlQuery = req.userAuth
            ? `SELECT n.*,COUNT( DISTINCT l.id) likes ,COUNT( DISTINCT u.id) dislikes, IF(MAX(l2.idUser) IS NULL,FALSE,TRUE) loggedUserLiked,IF(MAX(u2.idUser) IS NULL,FALSE,TRUE) loggedUserDisliked  FROM news n LEFT JOIN user_like_news l ON n.id=l.idNews LEFT JOIN user_like_news l2 ON (n.id=l2.idNews AND l2.idUser=?) LEFT JOIN user_unlike_news u ON n.id=u.idNews LEFT JOIN user_unlike_news u2 ON (n.id=u2.idNews AND u2.idUser=?)`
            : `SELECT n.*, COUNT(DISTINCT l.id) likes ,COUNT(DISTINCT u.id) dislikes FROM news n LEFT JOIN user_like_news l ON n.id=l.idNews LEFT JOIN user_unlike_news u ON n.id=u.idNews`;

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de newsSchema
        await validateSchema(filterThemeSchema, req.query);

        // Obtenemos los campos necesarios del req.body
        const { theme } = req.query;

        if (theme) {
            // Recuperamos los datos de las noticias guardadas en la base de datos
            sqlQuery += ' WHERE theme = ?';
        }

        sqlQuery += ' GROUP BY n.id  ORDER BY n.id DESC';

        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [news] = await connection.query(
            sqlQuery,
            req.userAuth ? [req.userAuth.id, req.userAuth.id, theme] : [theme]
        );

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
