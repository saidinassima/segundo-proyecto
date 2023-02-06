/* 
    Schema que controla el tipo de dato del tema para el filtrado de la noticia
*/

const Joi = require('joi');

const filterThemeSchema = Joi.object().keys({
    theme: Joi.string()
        .min(5)
        .max(20)
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

module.exports = filterThemeSchema;
