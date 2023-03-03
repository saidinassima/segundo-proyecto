/* 
    Controlador para insertar nuevo producto
*/

// Guardamos la conexion con la base de datos en una variable

const getDB = require('../../db/getDB');
const { validateSchema } = require('../../helpers');
const newsSchema = require('../../schemas/newsSchema');

//Creamos la funcion crear una noticia
const newNews = async (req, res, next) => {
    let connection;

    try {
        // Creamos una conexion con la base de datos
        connection = await getDB();

        // Recuperamos el id del usuario logueado
        const idUserAuth = req.userAuth.id;

        // Validamos los datos que recuperamos en el cuerpo de la petición con el schema de newsSchema
        await validateSchema(newsSchema, req.body);

        // Destructuramos los datos de la noticia del cuerpo de la peticion
        const { title, leadIn, text, theme } = req.body;

        // Insertamos los datos de la noticia en la base de datos
        const [data] = await connection.query(
            `
            INSERT INTO news(title,photo,leadIn,text,theme,idUser)
            VALUES (?, ?, ?, ?, ?,?)
        `,
            [title, null, leadIn, text, theme, idUserAuth]
        );

        // Respondemos con las datos de la noticia insertada
        res.send({
            status: 'Ok',
            message: '¡Noticia creada correctamente!',
            data: {
                id: data.insertId,
                idUser: idUserAuth,
                title: title,
                leadIn: leadIn,
                text: text,
                theme: theme,
                likes: 0,
                dislikes: 0,
                photo: null,
                loggedUserDisliked: 0,
                loggedUserLiked: 0,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Exportamos la funcion
module.exports = newNews;
