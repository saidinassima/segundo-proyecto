const getDB = require('../../db/getDB');

const listNews = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { search } = req.query;

        // Variable que guardará la consulta a la base de datos con las noticias
        let news;

        if (search) {
            [news] = await connection.query(
                `
                SELECT * FROM news
                WHERE theme LIKE ?
                `,
                [`%${search}%`]
            );
        } else {
            [news] = await connection.query(
                `
                SELECT * FROM news
                `
            );
        }

        // Responder
        res.send({
            status: 'ok',
            message: 'Lista de noticias',
            news,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listNews;
