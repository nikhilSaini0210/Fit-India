const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const dietRoutes = require("./diet.routes");
const workoutRoutes = require("./workout.routes");
const progressRoutes = require("./progress.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/diet", dietRoutes);
router.use("/workout", workoutRoutes);
router.use("/progress", progressRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FitIndia API is running 💪",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

module.exports = router;
