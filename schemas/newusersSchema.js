/* 
    Schema que controla el tipo de dato de los datos de los nuevos usuarios
*/

const Joi = require('joi');

const newUsersSchema = Joi.object().keys({
    username: Joi.string()
        .required()
        .min(3)
        .max(30)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El nombre es requerido!');
            } else {
                return new Error(
                    '¡El nombre debe tener entre 3 y 30 caracteres de longitud!'
                );
            }
        }),

    email: Joi.string().email(),

    password: Joi.string()
        .required()
        .min(5)
        .max(10)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El password es requerido!');
            } else {
                return new Error(
                    '¡El password debe tener entre 5 y 10 caracteres de longitud!'
                );
            }
        }),
});

module.exports = newUsersSchema;
