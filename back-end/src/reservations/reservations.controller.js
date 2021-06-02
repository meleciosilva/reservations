const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");

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
  res.json({ data });
}

module.exports = {
  create: [ 
    asyncErrorBoundary(hasOnlyValidProps),
    asyncErrorBoundary(hasRequiredProps),
    asyncErrorBoundary(create) 
  ],
  list: asyncErrorBoundary(list),
  read: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(read) ],
};
