const express = require("express");

const pushController = require("../controllers/push.controller");
const { protect, restrictTo } = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/register", pushController.registerToken); // app launch → register token
router.delete("/token", pushController.removeToken); // logout → remove token
router.get("/devices", pushController.listDevices); // see my devices
router.post("/test", pushController.sendTestPush); // test push to self

router.post("/send", restrictTo("admin"), pushController.sendCustomPush);
router.post("/broadcast", restrictTo("admin"), pushController.broadcastPush);

module.exports = router;
