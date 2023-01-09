const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const editNews = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        // Recuperamos el id del usuario logueado
        const idUserAuth = req.userAuth.id;
        // Recuperamos el id de la noticia de los path params
        const { idNews } = req.params;
        // Destructuramos el req.body
        const { title, leadIn, text, theme } = req.body;
        if (!title && !leadIn && !text && !theme) {
            throw generateError('si no modificas pa que tocas', 400);
        }
        // Seleccionamos los datos antiguos
        const [news] = await connection.query(
            `
        SELECT title, leadIn, text, theme FROM news WHERE id = ?
        `,
            [idNews]
        );
        if (news.length < 1) {
            throw generateError('La noticia que a modificado no existe', 400);
        }
        await connection.query(
            `
        UPDATE news SET title = ?, leadIn = ?, text = ?, theme = ? WHERE id = ?
        `,
            [
                title || news[0].title,
                leadIn || news[0].leadIn,
                text || news[0].text,
                theme || news[0].theme,
                idNews,
            ]
        );
        res.send({
            status: 'ok',
            message: 'Noticia modificado con éxito',
            product: [
                title || news[0].title,
                leadIn || news[0].leadIn,
                text || news[0].text,
                theme || news[0].theme,
            ],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = editNews;
