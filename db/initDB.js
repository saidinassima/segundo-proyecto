const getDB = require('./getDB');

async function main() {
    // Creamos una variable para guardar la conexión
    let connection;

    try {
        // Abrimos la conexion a la bbdd
        connection = await getDB();

        console.log('Eliminando tablas en caso que existan...');

        await connection.query(`DROP TABLE IF EXISTS user_unlike_news`);
        await connection.query(`DROP TABLE IF EXISTS user_like_news`);
        await connection.query(`DROP TABLE IF EXISTS news`);
        await connection.query(`DROP TABLE IF EXISTS user`);

        console.log('¡Tablas eliminadas!');

        console.log('Creando tablas...');

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                registrationCode VARCHAR(250)
                
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS news (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(100) NOT NULL,
                photo VARCHAR(255),
                leadIn VARCHAR(100) NOT NULL,
                text VARCHAR(255) NOT NULL,
                theme VARCHAR(100) NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id)
                ON DELETE CASCADE

            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user_like_news (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                idNews INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (idNews) REFERENCES news(id) ON DELETE CASCADE
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user_unlike_news (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                idNews INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (idNews) REFERENCES news(id) ON DELETE CASCADE
            )`
        );

        console.log('¡Tablas creadas!');

        console.log('Insertando unos datos de prueba...');

        await connection.query(
            `INSERT INTO user (username, email, password)
             VALUES ('userPrueba', 'prueba@gmail.com', '123')`
        );

        await connection.query(
            `INSERT INTO news (title, leadIn, text, theme,idUser)
             VALUES ('NoticiaPrueba', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.', 'Lorem ipsum dolor sit','Actualidad',1)`
        );

        await connection.query(
            `INSERT INTO user_like_news (id,idUser,idNews)
             VALUES (1,1,1)`
        );

        await connection.query(
            `INSERT INTO user_unlike_news (id,idUser,idNews)
             VALUES (1,1,1)`
        );

        console.log('¡Datos de prueba insertados con éxito!');
    } catch (error) {
        console.error(error.message);
    } finally {
        // Si existe una conexion a la base de datos, nos desconectamos
        if (connection) connection.release();
        process.exit();
    }
}

// Ejecutamos la funcion main
main();
