/* 
    Schema que controla el tipo de dato del id de las Noticias
*/

const Joi = require('joi');

const idNewsSchema = Joi.object().keys({
    idNews: Joi.number()
        .required()
        .positive()
        .integer()
        .min(1)
        .max(999)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'number.empty'
            ) {
                return new Error('¡El idNews es requerido!');
            } else {
                return new Error('¡El idNews debe ser entre 1 y 999!');
            }
        }),
});

module.exports = idNewsSchema;
