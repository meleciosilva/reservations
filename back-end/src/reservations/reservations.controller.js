const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const { validate, Joi } = require('express-validation')

const createReservationValidation = {
  body: Joi.object({
    data: Joi.object({
      first_name: Joi.string()
        .min(1)
        .max(20)
        .required(),
      last_name: Joi.string()
        .min(1)
        .max(20)
        .required(),
      mobile_number: Joi.string()
        .pattern(new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"))
        .required(),
      people: Joi.number()
          .strict()
          .min(1)
          .max(30)
          .required(),
      reservation_date: Joi.string()
        .pattern(new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}"))
        .required(),
      reservation_time: Joi.string()
        .pattern(new RegExp("^(?:[01][0-9]|2[0-3])[-:h][0-5][0-9]$"))
        .required(),
    })
  })
}

// valid properties for creating reservations
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

// Validation Middleware

function hasOnlyValidProps(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function hasRequiredProps(req, res, next) {
  const { data = {} } = req.body;

  VALID_PROPERTIES.forEach((property) => {
    if (!data[property]) {
      return next({ 
        status: 400,
        message: `A '${property}' property is required.`
       });
    }
  });
  next();
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await reservationsService.read(reservationId);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation id ${reservationId} cannot be found`
    });
  }
  res.locals.reservation = reservation;
  next();
}


// Router-level Middleware

async function list(req, res) {
  const data = await reservationsService.list();
  res.json({ data });
}

function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation })
}

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await reservationsService.create(newReservation);
  res.status(201).json({ data });
}

async function update(req, res) {
  const originalReservation = res.locals.reservation;
  const newReservation = {
    ...req.body.data,
    reservation_id: originalReservation.reservation_id
  }
  const data = await reservationsService.update(newReservation);
  res.json({ data });
}

async function destroy(req, res) {
  const reservationId = res.locals.reservation.reservation_id;
  await reservationsService.destroy(reservationId);
  res.sendStatus(204);
}

module.exports = {
  create: [ 
    asyncErrorBoundary(hasOnlyValidProps),
    asyncErrorBoundary(hasRequiredProps),
    validate(createReservationValidation, { keyByField: true }, {}),
    asyncErrorBoundary(create) 
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(hasOnlyValidProps),
    asyncErrorBoundary(hasRequiredProps),
    asyncErrorBoundary(update) 
  ],
  list: asyncErrorBoundary(list),
  read: [ asyncErrorBoundary(reservationExists), read ],
  delete: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy) ],
};
