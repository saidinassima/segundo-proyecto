const getDB = require("../../db/getDB");

const listNews = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { search, order, direction } = req.query;

        // Establecemos los valores válidos para por los que podemos ordenar
        const validOrderOptions = ['tema', 'createAt'];

        // Opciones válidas para la dirección
        const validDirectionOptions = ['ASC', 'DESC'];

        // Variable que guarda el valor para ordenar las noticias, por defecto
        const orderBy = validOrderOptions.includes(order) ? order : 'createAt';

        // Variable para establecer la dicreccion en la que ordenaremos
        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        // Variable que guardará la consulta a la base de datos con las noticias
        let news;

        if (search) {
            [news] = await connection.query(
                `
                SELECT * FROM news
                WHERE tema LIKE ?
                ORDER BY ${orderBy} ${orderDirection}`,
                [`%${search}%`]
            );
        }

        // Variable que guardará los datos de las noticias a listar
        const data = [];

        data.push({
            ...news[i],
        });

        // Responder
        res.send({
            status: 'ok',
            message: 'Lista de noticias',
            products: products,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listNews;