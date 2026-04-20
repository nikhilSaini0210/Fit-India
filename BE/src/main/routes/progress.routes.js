const express = require("express");

const progressController = require("../controllers/progress.controller");
const { protect } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const { logProgressSchema } = require("../validators/progress.validator");

const router = express.Router();

router.use(protect);

router.post(
  "/log",
  validate(logProgressSchema),
  progressController.logProgress,
);
router.get("/history", progressController.getHistory); // ?period=month&page=1
router.get("/summary", progressController.getSummary);
router.get("/streak", progressController.getStreak);
router.get("/latest", progressController.getLatest);

module.exports = router;
