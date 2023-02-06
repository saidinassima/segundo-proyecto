/* 
    Schema que controla el tipo de dato de los datos de edición del password del usuario
*/

const Joi = require('joi');

const editPassUserSchema = Joi.object().keys({
    email: Joi.string().email().required(),

    newPass: Joi.string()
        .required()
        .min(5)
        .max(10)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El nuevo password es requerido!');
            } else {
                return new Error(
                    '¡El nuevo password debe tener entre 5 y 10 caracteres de longitud!'
                );
            }
        }),
    confirmNewPass: Joi.string()
        .required()
        .min(5)
        .max(10)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El password confirmado es requerido!');
            } else {
                return new Error(
                    '¡El password confirmado debe tener entre 5 y 10 caracteres de longitud!'
                );
            }
        }),
});

module.exports = editPassUserSchema;
