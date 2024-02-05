const errorDictionary = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

function handleError(err, res) {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (errorDictionary[err.statusCode]) {
    statusCode = err.statusCode;
    message = errorDictionary[err.statusCode];
  }

  console.error(message);
  res.status(statusCode).json({ error: message });
}

module.exports = {
  CustomError,
  handleError,
};
