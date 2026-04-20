const morgan = require("morgan");
const logger = require("../utils/logger");
const { env } = require("../config/env");

morgan.token("id", (req) => req.id);

morgan.token("ip", (req) => req.ip);

morgan.token("user", (req) => req.user?._id?.toString() || "guest");

morgan.token("agent", (req) => {
  const ua = req.headers["user-agent"] || "";
  return ua.length > 60 ? ua.substring(0, 60) + "..." : ua;
});

const stream = {
  write: (message) => logger.http(message.trim()),
};

const format = env.isProduction
  ? ":id :ip :method :url :status :response-time ms user=:user agent=:agent"
  : "dev";

const requestLogger = morgan(format, { stream });

module.exports = requestLogger;
