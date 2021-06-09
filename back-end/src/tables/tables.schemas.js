const { Joi } = require('express-validation');

const createTableValidation = {
  body: Joi.object({
    data: Joi.object({
      table_name: Joi.string()
        .min(2)
        .max(20)
        .required(),
      capacity: Joi.number()
        .strict()
        .min(1)
        .required(),
      reservation_id: Joi.number()
        .min(1),
    })
  })
}

const seatReservationValidation = {
  body: Joi.object({
    data: Joi.object({
      reservation_id: Joi.number()
        .min(1)
        .required(),
    })
  })
}

module.exports = {
  createTableValidation,
  seatReservationValidation,
}