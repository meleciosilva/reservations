const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { validate, Joi } = require('express-validation');

// validation schema for creating reservation
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
    })
  })
}

// Validation Middleware

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];
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

function hasValidPropValues(req, res, next) {

  const { table_name, capacity, reservation_id } = req.body.data;
  const maxCapacity = res.locals.table.capacity;

  if (reservation_id != null) {
    return next({
      status: 400,
      message: `'${table_name}' is already occupied. Select another table.`
    });
  }
  if (capacity > maxCapacity) {
    return next({
      status: 400,
      message: `'${table_name}' can only seat ${maxCapacity} people. Your reservation has ${capacity} people.`
    });
  }

  next();
}

async function tableExists(req, res, next) {
  console.log(req.params.tableId)
  const table = await tablesService.read(req.params.tableId);
  if (!table) {
    return next({
      status: 400,
      message: `Table id ${req.params.tableId} cannot be found`
    });
  }
  res.locals.table = table;
  next();
}

//Router-level Middleware

async function list(req, res) {
  const data = await tablesService.list();
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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProps,
    hasRequiredProps,
    // hasValidPropValues,
    validate(createTableValidation, { keyByField: true }, {}),
    asyncErrorBoundary(create)
  ],
  update: [
    tableExists,
    // hasOnlyValidProps,
    // hasRequiredProps,
    hasValidPropValues,
    asyncErrorBoundary(update),
  ]
}