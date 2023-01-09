const getDB = require('../../db/getDB');
const { deletePhoto } = require('../../helpers');

const deleteNews = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB;

        // Destructuramos el id de la noticia
        const { idNews } = req.params;

        // Primero comprobamos que e la noticia tiene fotos
        const [photos] = await connection.query(
            `
        SELECT name FROM news_photo WHERE idNews = ?
        `,
            [idNews]
        );

        // Utilizamos un bucle para recorrer las fotos de la noticia de 1 en 1 y eliminarlas del servidor
        for (let i = 0; i < photos.length; i++) {
            // Ejecutamos la función deletePhoto para eliminar cada una de las fotos de la noticia
            await deletePhoto(photos[i].name, 1);
        }

        // Eliminamos las fotos de la noticia en la base de datos
        await connection.query(
            `
        DELETE FROM news_photo WHERE idNews = ?
        `,
            [idNews]
        );
        // Una vez eliminadas las fotos, eliminamos la noticia
        await connection.query(
            `
        DELTE FROM news WHERE id = ? 
        `,
            [idNews]
        );

        res.send({
            stauts: 'ok',
            message: 'Noticia eliminada con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = deleteNews;
