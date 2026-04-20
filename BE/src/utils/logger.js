const { createLogger, format, transports } = require("winston");
const { env } = require("../config/env");

const { combine, timestamp, colorize, printf, json, errors } = format;

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: env.isProduction ? "info" : "debug",

  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },

  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    env.isProduction ? json() : combine(colorize(), devFormat),
  ),
  transports: [
    new transports.Console(),
    ...(env.isProduction
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }),
          new transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
  exitOnError: false,
});

module.exports = logger;
