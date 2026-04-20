const express = require("express");

const { protect } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");

const userController = require("../controllers/user.controller");
const {
  updateProfileSchema,
  updateNotificationsSchema,
} = require("../validators/user.validator");

const router = express.Router();

router.use(protect);

router.get("/profile", userController.getProfile);
router.patch(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile,
);
router.patch(
  "/notifications",
  validate(updateNotificationsSchema),
  userController.updateNotifications,
);
router.get("/nutrition-targets", userController.getNutritionTargets);
router.delete("/account", userController.deleteAccount);

module.exports = router;
