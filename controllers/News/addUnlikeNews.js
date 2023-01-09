const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const addDunlikesNews = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        // Recuperamos el id del usuario
        const idUserAuth = req.userAuth.id;
        // Destructuramos el id de las noticias de los path params
        const { idNews } = req.params;
        // Comprobamos que el ususario no es el propietario de la noticia
        const [news] = await connection.query(
            `SELECT * FROM news WHERE id = ?`,
            [idNews]
        );
        // Si el idUser de la consulta es igual al id del ususario logueado
        if (news[0].idUser === idUserAuth) {
            throw generateError(
                'No puedes añadir a favoritos a tus publicaciones',
                409
            );
        }
        // Comprobar que este usuario no tiene añadido ya esta noticia a sus dislikes
        const [[dislike]] = await connection.query(
            `SELECT * FROM user_unlike_news WHERE idUser = ? AND idNews = ?`,
            [idUserAuth, idNews]
        );
        // Si no está en no favoritos, lo añadimos
        if (!dislike) {
            await connection.query(
                `INSERT INTO user_unlike_news (idUser, idNews)
                VALUES(?, ?) `,
                [idUserAuth, idNews]
            );
            res.send({
                status: 'ok',
                message: 'La noticia se ha añadido a tus no favoritos',
            });
        } else {
            // Si la noticia está marcada como dislike, la eliminamos
            await connection.query(
                `DELETE FROM user_unlike_news WHERE idUser = ? AND idNews = ?`,
                [idUserAuth, idNews]
            );

            res.send({
                status: 'ok',
                message: 'La noticia se ha borrado de los no favoritos',
            });
        }
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = addDunlikesNews;
