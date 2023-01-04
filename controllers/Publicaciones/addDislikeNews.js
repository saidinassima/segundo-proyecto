const getDB = require("../../db/getDB");
const { generateError } = require("../../helpers");

const addDislikesNews = async (req, res, next) => {
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
                'No puedes añadir a no te gusta tus publicaciones',
                409
            );
        }

        // Comprobar que este usuario no tiene añadido ya esta noticia a sus likes
        const [like] = await connection.query(
            `SELECT * FROM user_like_news WHERE idUser = ? AND idNews = ?`,
            [idUserAuth, idNews]
        );

        // Si esta consulta devuelve algún valor, ya ha añadido ese producto a fav, error
        if ((like, this.length > 0)) {
            throw generateError('Ese producto ya está en favoritos', 409); //Conflict
        }

        // Si no está en no favoritos, lo añadimos
        await connection.query(
            `INSERT INTO user_dislike_news (idUser, idNews)
            VALUES(?, ?) `,
            [idUserAuth, idNews]
        );

        res.send({
            status: 'ok',
            message: 'La noticia se ha añadido a tus no favoritos',
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

        // Consultamos a la base de datos si la noticia ha sido marcada por el usuario como dislike
        const [news] = await connection.query(
            `SELECT * FROM user_dislike_news WHERE idUser = ? AND idNews = ?`,
            [idUserAuth, idNews]
        );
        
        // Si la noticia está marcada como dislike, la eliminamos
        await connection.query(
            `DELETE FROM user_dislike_news WHERE idUser = ? AND idNews = ?`,
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

module.exports = addDislikesNews;