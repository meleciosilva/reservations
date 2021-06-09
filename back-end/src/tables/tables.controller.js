const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { validate, Joi } = require('express-validation');

// validation schemas

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

// Table Validation Middleware

async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.tableId);
  if (!table) {
    return next({
      status: 404,
      message: `Table id ${req.params.tableId} cannot be found`
    });
  }
  res.locals.table = table;
  next();
}

function isTableOccupied(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `'${table.table_name}' is not occupied`
    });
  }
  next();
}

// Reservation Validation Middleware

async function reservationExists(req, res, next) {
  const reservation = await tablesService.readReservation(req.body.data.reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation id ${req.body.data.reservation_id} cannot be found`
    });
  }
  res.locals.reservation = reservation;
  next();
}

function reservationCanBeSeated(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;

  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: `Reservation id ${reservation.reservation_id} has already been seated`
    });
  }
  if (table.reservation_id) {
    return next({
      status: 400,
      message: `'${table.table_name}' is already occupied. Select another table.`
    });
  }
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `'${table.table_name}' does not have sufficient capacity to seat ${reservation.people} people.`
    });
  }

  next();
}

// Router-level Middleware

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

function read(req, res) {
  const data = res.locals.table;
  res.json({ data });
}

async function create(req, res) {
  const newTable = req.body.data;
  const data = await tablesService.create(newTable);
  res.status(201).json({ data });
}

// updates table with reservation_id AND updates reservation status to "seated"
function updateTableAndReservationStatus(req, res, next) {
  const { reservation_id } = req.body.data;
  const updatedTable = {
    ...res.locals.table,
    reservation_id, 
    table_id: res.locals.table.table_id
  }

  const originalReservation = res.locals.reservation;
  const updatedReservation = {
    ...originalReservation,
    status: "seated",
    reservation_id: originalReservation.reservation_id
  }

  return tablesService.updateTableAndReservationStatus(updatedTable, updatedReservation)
    .then((data) => res.json({ data }))
    .catch(next);
}

function deleteTableAndUpdateReservation(req, res, next) {
  const reservationId = res.locals.table.reservation_id;
  res.locals.table.reservation_id = null;  // removes reservation_id from table 

  return tablesService.deleteTableAndUpdateReservation(res.locals.table, reservationId)
    .then(() => res.json({ data: { message: "Reservation Successfully Finished" } }))
    .catch(next);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(tableExists),
    read,
  ],
  create: [
    validate(createTableValidation, { keyByField: true }, {}),
    asyncErrorBoundary(create),
  ],
  update: [
    validate(seatReservationValidation, { keyByField: true }, {}),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    reservationCanBeSeated,
    updateTableAndReservationStatus,
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isTableOccupied,
    deleteTableAndUpdateReservation,
  ],
}