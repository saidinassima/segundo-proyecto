/* 
    Schema que controla el tipo de dato del id de los usuarios
*/

const Joi = require('joi');

const idUserSchema = Joi.object().keys({
    idUser: Joi.number()
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
                return new Error('¡El idUser es requerido!');
            } else {
                return new Error('¡El idUser debe ser entre 1 y 999!');
            }
        }),
});

module.exports = idUserSchema;
