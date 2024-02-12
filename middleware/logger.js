const { createLogger, transports, format } = require("winston");

const logFormat = format.combine(
  format.timestamp(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

let loggerMiddleware;

if (process.env.NODE_ENV === "production") {
  loggerMiddleware = createLogger({
    level: "info",
    format: logFormat,
    transports: [
      new transports.File({ filename: "errors.log", level: "error" }),
    ],
  });
} else {
  loggerMiddleware = createLogger({
    level: "debug",
    format: logFormat,
    transports: [
      new transports.Console(),
      new transports.File({ filename: "errors.log", level: "error" }),
    ],
  });
}

module.exports = { loggerMiddleware };
