const getDB = require('../db/getDB');
const { generateError } = require('../helpers');


const editNews = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB;

        // Recuperamos el id del usuario logueado
        const idUserAuth = req.userAuth.id;

        // Recuperamos el id de la noticia de los path params
        const { idNews } = req.params;

        // Destructuramos el req.body
        const { titulo, entradilla, texto, tema } = req.body;

        if (!titulo && !entradilla && !texto && !tema) {
            throw generateError('si no modificas pa que tocas', 400);
        }

        // Seleccionamos los datos antiguos
        const [news] = await connection.query(
            `
        SELECT titulo, entradilla, texto, tema FROM news WHERE id = ?
        `,
            [idNews]
        );

        if (news.length < 1) {
            throw generateError('La noticia que a modificado no existe', 400);
        }

        await connection.query(
            `
        UPDATE news SET titulo = ?, entradilla = ?, texto = ?, tema = ? SHERE id = ?
        `,
            [
                titulo || news[0].titulo,
                entradilla || news[0].entradilla,
                texto || news[0].texto,
                tema || news[0].tema,
                idNews,
            ]
        );

        res.send({
            status: 'ok',
            message: 'Noticia modificado con éxito',
            product: [
                titulo || news[0].titulo,
                entradilla || news[0].entradilla,
                texto || news[0].texto,
                tema || news[0].tema,
            ],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = editNews;
