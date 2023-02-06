/* 
    Schema que controla el tipo de dato de authorization de isAuth
*/

const Joi = require('joi');

const authSchema = Joi.object().keys({
    authorization: Joi.string()
        .required()
        .length(137)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El authorization es requerido!');
            } else {
                return new Error(
                    '¡El authorization debe tener 137 caracteres de longitud!'
                );
            }
        }),
});

module.exports = authSchema;
