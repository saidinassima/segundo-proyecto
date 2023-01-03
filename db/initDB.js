const getDB = require('./getDB');

async function main() {
    // Creamos una variable para guardar la conexión
    let connection;

    try {
        // Abrimos la conexion a la bbdd
        connection = await getDB();

        console.log('Eliminando tablas en caso que existan...');

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

        console.log('¡Tablas creadas!');

        console.log('Insertando unos datos de prueba...');

        await connection.query(
            `INSERT INTO user (username, email, password)
             VALUES ('userPrueba', 'prueba@gmail.com', '123')`
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
