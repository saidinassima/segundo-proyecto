/* 
    Controlador que permite añadir una nueva foto a la noticia
*/

const getDB = require('../../db/getDB');
const { generateError, savePhoto, deletePhoto } = require('../../helpers');

const addNewsPhoto = async (req, res, next) => {
    let connection;

    try {
        // Guardamos la conexion en una variable
        connection = await getDB();

        // Recuperamos el id del usuario logueado
        const idUserAuth = req.userAuth.id;

        // Comprobamos que nos ha enviado una foto nueva para añadir
        if (!req.files || !req.files.photo) {
            throw generateError(
                '¡Debes indicar una nueva foto de la Noticia!',
                400
            ); // Bad Request
        }

        // Obtenemos la foto antigua de la Noticia
        const [photoNews] = await connection.query(
            `SELECT photo FROM news WHERE idUser = ?`,
            [idUserAuth]
        );

        // Si la noticia tiene una foto antigua la vamos a eliminar primero
        if (photoNews[0].photo) {
            // Eliminamos la foto del servidor
            await deletePhoto(photoNews[0].photo, 0);
        }

        // Ejecutamos la funcion savePhoto para guardar en el servidor la nueva foto de la noticia
        // y guardamos en la variable photoName el nombre de la imagen que devuelve la función
        const photoName = await savePhoto(req.files.photo, 1); // 1 -> indica que lo guardamos en static/photos

        // Añadimos la foto de la noticia del usuario concreto a la base de datos
        await connection.query(`UPDATE news SET photo = ? WHERE idUser = ?`, [
            photoName,
            idUserAuth,
        ]);

        // Respondemos
        res.send({
            status: 'Ok',
            message: '¡Foto de la Noticia añadida con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addNewsPhoto;
