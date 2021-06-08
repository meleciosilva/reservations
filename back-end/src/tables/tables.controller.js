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

// Validation Middleware

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

  if (table.reservation_id != null) {
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

//Router-level Middleware

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

async function update(req, res) {
  const originalTable = res.locals.table;
  const updatedTable = {
    ...originalTable,
    ...req.body.data,
    table_id: originalTable.table_id
  }
  const data = await tablesService.update(updatedTable);
  res.json({ data });
}

function destroy(req, res, next) {
  res.locals.table.reservation_id = null; // removes reservation_id from table
  tablesService
    .destroy(res.locals.table.table_id)
    .then(() => tablesService.create(res.locals.table))
    .then(() => res.json({ data: { message: "Successfully Deleted" } }))
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
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isTableOccupied,
    destroy,
  ]
}