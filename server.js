const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Creamos el servidor
const app = express();

// Middleware para cors
app.use(cors());

// Deserializamos el body en formato raw
app.use(express.json());

// Middleware de Morgan para obtener más información sobre cada una de las peticiones
app.use(morgan('dev'));

// Middleware para leer el body en formato form-data (para leer archivos e imágenes)
// instalación -> npm i express-fileupload
app.use(fileUpload());

/*
################
## MIDDLEWARE ##
################
*/
const isAuth = require('./middlewares/isAuth');
const canEditNews = require('./middlewares/canEditNews');

/*   ### Controladores de Usuarios ###  */

const newUser = require('./controllers/users/newUser');

const loginUser = require('./controllers/users/loginUser');

/*   ### Endpoints Usuarios ###  */

// Registro de usuario
app.post('/register', newUser);

// Login de usuario
app.post('/login', loginUser);

/*
############################
#### CONTROLADORES NEWS ####
############################
*/
const editNews = require('./controllers/Publicaciones/editarNoticia');
const deleteNews = require('./controllers/Publicaciones/eliminarNoticia');
const listNews = require('./controllers/Publicaciones/listTema');
const addLikesNews = require('./controllers/Publicaciones/addLikesNews');
const addDislikesNews = require('./controllers/Publicaciones/addDislikeNews');

/*
######################
### ENDPOINTS NEWS ###
######################
*/
// Editar datos de la noticia
app.put('/Publicaciones/:idNews', isAuth, canEditNews, editNews);
// Eliminar una noticia
app.delete('/Publicaciones/:idNews', isAuth, canEditNews, deleteNews);
// Filtrar noticias por temas
app.get('Publicaciones', listNews);
// Agregar o quitar Publicación de like
app.post('/Publicaciones/:idNews', isAuth, addLikesNews);
// Agregar o quitar Publicación de Dislike
app.post('/Publicaciones/:idNews', isAuth, addDislikesNews);

// Middleware de Error
app.use((error, req, res, _) => {
    console.error(error);

    res.status(error.httpStatus || 500);

    res.send({
        status: 'Error',
        message: error.message,
    });
});

// Middleware de Not Found
app.use((req, res) => {
    res.status(404);

    res.send({
        status: 'Error',
        message: 'Not found',
    });
});

// Ponemos el servidor a la escucha
app.listen(3000, () => {
    console.log(`Server listening at http://localhost:3000`);
});
