/**
 * Express API error handler.
 */

const { ValidationError } = require('express-validation');

function errorHandler(error, request, response, next) {
  
  // returns error from createReservationValidation 
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error)
  }
  
  // handles other errors
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
