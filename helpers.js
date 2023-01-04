const { unlink } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Recuperamos las variables de entorno

// Función que genera un código aleatorio para validar al usuario
function generateRandomCode(length) {
    return crypto.randomBytes(length).toString('hex');
}

// Funcion que genera un error
function generateError(message, code) {
    const error = new Error(message);
    error.httpStatus = code;
    return error;
}

// Función que elimina una imagen del servidor
async function deletePhoto(photoName, type) {
    try {
        // Variable guarda ruta absoluta a imagen a borrar
        let photoPath;
        if (type === 0) {
            // Si es type o, es imagin de avata

            photoPath = path.join(avatarDir, photoName);
        } else if (type === 1) {
            photoPath = path.join(productDir, photoName);
        }

        // una vez tenemos la ruta la eliminamos
        await unlink(photoPath);
    } catch (error) {
        throw new Error('¡Error al procesar la imagen del servidor!');
    }
}

// Exportamos las funciones
module.exports = {
    generateError,
    generateRandomCode,
    deletePhoto,
};
