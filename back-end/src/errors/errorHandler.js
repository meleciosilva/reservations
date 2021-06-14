const { ValidationError } = require("express-validation");

function errorHandler(error, request, response, next) {
  // returns error from createReservationValidation
  if (error instanceof ValidationError) {
    const { details } = error;
    // returns error message from keysByField error details
    return response
      .status(error.statusCode)
      .json({ error: Object.entries(details[0])[0][1] });
  }

  // handles other errors
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
