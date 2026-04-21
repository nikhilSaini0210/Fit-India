const express = require("express");

const notificationController = require("../controllers/notification.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/webhook", notificationController.verifyWebhook);
router.post("/webhook", notificationController.handleWebhook);

router.use(protect);

router.post("/test", notificationController.sendTestReminder);
router.get("/history", notificationController.getHistory);

module.exports = router;
