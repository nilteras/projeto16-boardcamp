import joi from 'joi'

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().regex(/^\d{10,11}$/).min(10).max(11).required(),
    cpf: joi.string().regex(/^[0-9]{11}$/).min(11).max(11).required(),
    birthday: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required()

})