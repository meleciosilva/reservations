const { Joi } = require("express-validation");

const createReservationValidation = {
  body: Joi.object({
    data: Joi.object({
      reservation_id: Joi.number().strict().min(1),
      first_name: Joi.string().min(1).max(20).required(),
      last_name: Joi.string().min(1).max(20).required(),
      mobile_number: Joi.string()
        .pattern(
          new RegExp("^[+]?[(]?[0-9]{0,3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$")
        )
        .message("'mobile_number' should have a minimum of 7 digits'")
        .required(),
      people: Joi.number().strict().min(1).required(),
      reservation_date: Joi.string()
        .pattern(new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$"))
        .message("'reservation_date' should be formatted: 'YYYY-MM-DD'")
        .required(),
      reservation_time: Joi.string()
        .pattern(new RegExp("^(?:[01][0-9]|2[0-3])[-:h][0-5][0-9]$"))
        .message("'reservation_time' should be formatted as follows: 'HH:MM'")
        .required(),
      status: Joi.string()
        .pattern(new RegExp("^booked$"))
        .message(
          "reservation status can only be 'booked', not 'seated' or 'finished'"
        ),
      created_at: Joi.date(),
      updated_at: Joi.date(),
    }),
  }),
};

const updateStatusValidation = {
  body: Joi.object({
    data: Joi.object({
      status: Joi.string()
        .pattern(new RegExp("^seated$|^finished$|^booked$|^cancelled$"))
        .message(
          "unknown status - must be one of [booked, seated, finished, cancelled]"
        )
        .required(),
    }),
  }),
};

module.exports = {
  createReservationValidation,
  updateStatusValidation,
};
