import joi from 'joi'

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri({ scheme: [/https?/] }).required(),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required()
})