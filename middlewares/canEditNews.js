const getDB = require('../db/getDB');
const { generateError, validateSchema } = require('../helpers');
const idNewsSchema = require('../schemas/idNewsSchema');

const canEditNews = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        // Recuperamos el id del usuario que tiene la sesión iniciada
        const idUserAuth = req.userAuth.id;

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de idNewsSchema
        validateSchema(idNewsSchema, req.params);

        // Destructuramos de los parámetros de ruta el id de la noticia que quiere modificar
        const { idNews } = req.params;

        // Si la consulta de la base de datos no devuelve ningún valor, es que esta noticia no pertenece al usuario que tiene la sesión iniciada
        const [news] = await connection.query(
            `
        SELECT * FROM news WHERE id = ? AND idUser = ?
        `,
            [idNews, idUserAuth]
        );
        if (news.length < 1) {
            throw generateError(
                'No eres el propietario de la noticia que intentas editar',
                401
            );
        }
        // Si no da el error, quere decir que eres el propietario, pasamos la pelota
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = canEditNews;
