const getDB = require('../../db/getDB');
const { generateError, validateSchema } = require('../../helpers');
const idNewsSchema = require('../../schemas/idNewsSchema');

const addDunlikesNews = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        // Recuperamos el id del usuario
        const idUserAuth = req.userAuth.id;

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de idNewsSchema
        validateSchema(idNewsSchema, req.params);

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
        // Si no hay dislike, lo creamos y eliminamos el like
        if (!dislike) {
            await connection.query(
                `INSERT INTO user_unlike_news (idUser, idNews)
                VALUES(?, ?) `,
                [idUserAuth, idNews]
            );

            await connection.query(
                `DELETE FROM user_like_news WHERE idUser = ? AND idNews = ?`,
                [idUserAuth, idNews]
            );

            res.send({
                status: 'ok',
                message: 'Se le ha dado dislike a la noticia',
                data: { unliked: true },
            });
        } else {
            // Si la noticia está marcada como dislike, la eliminamos
            await connection.query(
                `DELETE FROM user_unlike_news WHERE idUser = ? AND idNews = ?`,
                [idUserAuth, idNews]
            );

            res.send({
                status: 'ok',
                message: 'Se ha quitado el dislike',
                data: { unliked: false },
            });
        }
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = addDunlikesNews;
