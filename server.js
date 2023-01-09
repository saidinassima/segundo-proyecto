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

/*   ### Controladores de Usuarios ###  */

const newUser = require('./controllers/users/newUser');
const loginUser = require('./controllers/users/loginUser');

/*   ### Controladores de News ###  */

const newNews = require('./controllers/News/newNews');
const listUserNews = require('./controllers/News/listUserNews');
const photoNews = require('./controllers/News/addNewsPhoto');
const listNews = require('./controllers/News/listNews');
const listFilterUserNews = require('./controllers/News/listFilterNews');

/*   ### Middlewares ###  */

// Middleware de validación de usuario
const isAuth = require('./middlewares/isAuth');
const { application } = require('express');

/*   ### Endpoints Usuarios ###  */

// Registro de usuario
app.post('/register', newUser);

// Login de usuario
app.post('/login', loginUser);

/*   ### Endpoints News ###  */

// Registrar nueva Noticia
app.post('/newNews', isAuth, newNews);

// Listar las Noticias de un usuario
app.get('/listUserNews', isAuth, listUserNews);

// Listar todas las noticias
app.get('/listNews', listNews);

// Listar Noticias filtradas por tema
app.get('/listFilterNews', listFilterUserNews);

// Añadir la photo de la Noticia
app.post('/addPhoto', isAuth, photoNews);

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
