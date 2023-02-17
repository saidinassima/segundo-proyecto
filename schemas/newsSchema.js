/* 
    Schema que controla el tipo de dato de los datos de las noticias
*/

const Joi = require('joi');

const newsSchema = Joi.object().keys({
    title: Joi.string()
        .required()
        .min(1)
        .max(100)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El titulo es requerido!');
            } else {
                return new Error(
                    '¡El titulo debe tener entre 3 y 30 caracteres de longitud!'
                );
            }
        }),
    leadIn: Joi.string()
        .min(1)
        .max(100)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El leadIn es requerido!');
            } else {
                return new Error(
                    '¡El leadIn debe tener entre 10 y 50 caracteres de longitud!'
                );
            }
        }),

    text: Joi.string()
        .min(1)
        .max(100)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El texto es requerido!');
            } else {
                return new Error(
                    '¡El texto debe tener entre 10 y 100 caracteres de longitud!'
                );
            }
        }),

    theme: Joi.string()
        .required()
        .min(5)
        .max(100)
        .regex(/[A-Za-z]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El Tema es requerido!');
            } else {
                return new Error(
                    '¡El Tema debe tener entre 10 y 100 caracteres de longitud!'
                );
            }
        }),
});

module.exports = newsSchema;
