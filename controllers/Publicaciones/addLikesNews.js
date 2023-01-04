const getDB = require("../../db/getDB");
const { generateError } = require("../../helpers");

const addLikesNews = async (req, res, next) => {
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
        if (product[0].idUser === idUserAuth) {
            throw generateError(
                'No puedes añadir a favoritos a tus publicaciones',
                409
            );
        }

        // Comprobar que este usuario no tiene añadido ya esta noticia a sus likes
        const [like] = await connection.query(
            `SELECT * FROM user_like_news WHERE idUser = ? AND idNews = ?`,
            [idUserAuth, idNews]
        );

        // Si no está en favoritos, lo añadimos
        await connection.query(
            `INSERT INTO user_like_news (idUser, idNews)
            VALUES(?, ?) `,
            [idUserAuth, idNews]
        );

        res.send({
            status: 'ok',
            message: 'La noticia se ha añadido a tus favoritos',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }

    try {
        connection = await getDB();

        // Recuperar el id del usuario logeuado
        const idUserAuth = req.userAuth.id;

        // Destructurar el id del producto por path params
        const { idNews } = req.params;

        // Consultamos a la base de datos si la noticia ha sido marcada por el usuario como like
        const [news] = await connection.query(
            `SELECT * FROM user_like_news WHERE idUser = ? AND idNews = ?`,
            [idUserAuth, idNews]
        );

        // Si la noticia está marcada como like, la eliminamos
        await connection.query(
            `DELETE FROM user_like_news WHERE idUser = ? AND idNews = ?`,
            [idUserAuth, idNews]
        );

        res.send({
            status: 'ok',
            message: 'Producto eliminado de favoritos',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addLikesNews;