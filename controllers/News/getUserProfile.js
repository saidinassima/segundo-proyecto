/* 
    Controlador para Mostrar las noticias de un usuario logeado
*/

//Guardamos la conexion con la base de datos en una variable
const getDB = require('../../db/getDB');

// Creamos la funcion listas noticias
const getUserProfile = async (req, res, next) => {
    let connection;

    try {
        //Creamos la conexion con la base de datos
        connection = await getDB();

        // Recuperamos el id del usuario que ha iniciado sesion
        const idUserAuth = req.userAuth.id;

        const [[user]] = await connection.query(
            `SELECT id,username,email FROM user WHERE id = ?`,
            [idUserAuth]
        );

        // Recuperamos los datos de las noticias guardadas en la base de datos
        const [news] = await connection.query(
            `SELECT n.*,COUNT( DISTINCT l.id) likes ,COUNT( DISTINCT u.id) dislikes FROM news n LEFT JOIN user_like_news l ON n.id=l.idNews LEFT JOIN user_unlike_news u ON n.id=u.idNews WHERE n.idUser = ? GROUP BY n.id ORDER BY n.id DESC`,
            [idUserAuth]
        );

        user.news = news;

        // Respondemos con las noticias del usuario
        res.send({
            status: 'Ok',
            message: '¡Perfil Usuario:!',
            user,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

//Exportamos la funcion
module.exports = getUserProfile;
