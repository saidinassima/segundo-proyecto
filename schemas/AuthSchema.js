/* 
    Schema que controla el tipo de dato de authorization de isAuth
*/

const Joi = require('joi');

const authSchema = Joi.object().error((errors) => {
    if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
    ) {
        return new Error('¡El authorization es requerido!');
    } else {
        return new Error('¡El authorization debe ser un objeto!');
    }
});

module.exports = authSchema;
