const express = require("express");
const { default: helmet } = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { env } = require("./config/env");

const requestId = require("./middleware/requestId.middleware");
const requestLogger = require("./middleware/logger.middleware");
const { apiLimiter } = require("./middleware/rateLimiter.middleware");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler.middleware");

const routes = require("./main/routes");
const sanitizer = require("./middleware/sanitize.middleware");

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: [env.frontendUrl, "http://localhost:5471"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── Parsing & compression ────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(compression());
app.use(sanitizer);

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use(requestId);
app.use(requestLogger);

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// Root ping (load balancer / uptime checks)
app.get("/", (req, res) => {
  res.json({ message: `🇮🇳 FitIndia API v1 — ${env.nodeEnv}` });
});

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
