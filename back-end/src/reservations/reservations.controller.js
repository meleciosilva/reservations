const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const { validate, Joi } = require('express-validation');

// validation schema for creating reservation
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
        .pattern(new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")).message("'mobile_number' should have a minimum of 10 digits'")
        .required(),
      people: Joi.number()
        .strict()
        .min(1)
        .required(),
      reservation_date: Joi.string()
        .pattern(new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")).message("'reservation_date' should be formatted: 'YYYY-MM-DD'")
        .required(),
      reservation_time: Joi.string()
        .pattern(new RegExp("^(?:[01][0-9]|2[0-3])[-:h][0-5][0-9]$")).message("'reservation_time' should be formatted as follows: 'HH:MM'")
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

function scheduledForFuture(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  
  const day = new Date(reservation_date).getUTCDay();
  const time = reservation_time;
  const date = reservation_date;
  const currentTime = Date.now();
  
  if ( currentTime > Date.parse(`${date} ${time}`) ) {
    return next({
      status: 400,
      message: "You cannot make a reservation in the past. Select a future date and/or time."
    });
  }
  if (day === 2 ) {
    return next({
      status: 400,
      message: "Sorry, we are closed on Tuesdays"
    });
  }
  if (time < "10:30" || time > "21:30") {
    return next({
      status: 400,
      message: "Please make a reservation between 10:30am - 9:30pm"
    });
  }

  next();
}

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
  const { date } = req.query;
  const data = await reservationsService.list();
  const byResult = date ? reservation => JSON.stringify(reservation.reservation_date).includes(date) : () => true;
  res.json({ data: data.filter(byResult) });
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
    asyncErrorBoundary(scheduledForFuture),
    asyncErrorBoundary(create) 
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(hasOnlyValidProps),
    asyncErrorBoundary(hasRequiredProps),
    validate(createReservationValidation, { keyByField: true }, {}),
    asyncErrorBoundary(scheduledForFuture),
    asyncErrorBoundary(update)
  ],
  list: asyncErrorBoundary(list),
  read: [ asyncErrorBoundary(reservationExists), read ],
  delete: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy) ],
};
