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

// Exportamos las funciones
module.exports = {
    generateError,
    generateRandomCode,
};
