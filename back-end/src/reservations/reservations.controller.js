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
        .pattern(new RegExp("^[\+]?[(]?[0-9]{0,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")).message("'mobile_number' should have a minimum of 7 digits'")
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
      status: Joi.string()
        .pattern(new RegExp("^booked$")).message("reservation status can only be 'booked', not 'seated' or 'finished'")
        .required(),
    })
  })
}

const updateStatusValidation = {
  body: Joi.object({
    data: Joi.object({
      status: Joi.string()
        .pattern(new RegExp("^seated$|^finished$|^booked$")).message("unknown status - must be one of [booked, seated, finished]")
        .required()
    })
  })
}

// Validation Middleware

function scheduleWhileOpen(req, res, next) {
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

function isStatusFinished(req, res, next) {
  const { status, first_name, last_name } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: `${first_name} ${last_name}'s reservation cannot be updated because it is already finished`
    });
  }
  next();
}

// Router-level Middleware

async function list(req, res) {
  const { date } = req.query;
  const data = await reservationsService.list();
  const byResult = date ? reservation => JSON.stringify(reservation.reservation_date).includes(date) && reservation.status !== "finished" : () => true;
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
    ...originalReservation, // added to supplement PUT requests made to update status due to minimal request body
    ...req.body.data,
    reservation_id: originalReservation.reservation_id
  }
  const data = await reservationsService.update(newReservation);
  // if PUT request made to update status, then return new status
  if (req.originalUrl.includes("status")) {
    const { status } = data[0];
    return res.json({ data: {status} });
  }
  res.json({ data });
}

async function destroy(req, res) {
  const reservationId = res.locals.reservation.reservation_id;
  await reservationsService.destroy(reservationId);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],
  create: [ 
    validate(createReservationValidation, { keyByField: true }, {}),
    scheduleWhileOpen,
    asyncErrorBoundary(create),
  ],
  update: [
    validate(createReservationValidation, { keyByField: true }, {}),
    asyncErrorBoundary(reservationExists),
    scheduleWhileOpen,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    validate(updateStatusValidation, { keyByField: true }, {}),
    asyncErrorBoundary(reservationExists),
    isStatusFinished,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroy),
  ],
};
