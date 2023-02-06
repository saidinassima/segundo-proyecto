/* 
    Schema que controla el tipo de dato de los datos de edición de la informacón del usuario
*/

const Joi = require('joi');

const editUserDataSchema = Joi.object().keys({
    newUsername: Joi.string()
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

    newEmail: Joi.string().email().required(),
});

module.exports = editUserDataSchema;
