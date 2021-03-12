// --------------------------------------------------
//   Require
//   参照：https://github.com/winstonjs/winston
// --------------------------------------------------

const winston = require("winston");

// --------------------------------------------------
//   Create Logger
// --------------------------------------------------

const logger = winston.createLogger({
  level: "info",
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: "log/error.log",
      maxsize: 1048576,
      level: "error",
    }),

    new winston.transports.File({
      filename: "log/combined.log",
      maxsize: 1048576,
    }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
