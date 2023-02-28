const getDB = require('../../db/getDB');
const { deletePhoto, validateSchema } = require('../../helpers');
const idNewsSchema = require('../../schemas/idNewsSchema');

const deleteNews = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de idNewsSchema
        validateSchema(idNewsSchema, req.params);

        // Destructuramos el id de la noticia
        const { idNews } = req.params;

        // Primero comprobamos que e la noticia tiene fotos
        const [[entries]] = await connection.query(
            `
        SELECT photo FROM news WHERE id = ?
        `,
            [idNews]
        );

        if (!entries) {
            // Ejecutamos la función deletePhoto para eliminar cada una de las fotos de la noticia
            await deletePhoto(entries.photo);
        }

        // Eliminamos las fotos de la noticia en la base de datos
        await connection.query(
            `
        DELETE FROM news WHERE id = ?
        `,
            [idNews]
        );

        res.send({
            status: 'ok',
            message: 'Noticia eliminada con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = deleteNews;
