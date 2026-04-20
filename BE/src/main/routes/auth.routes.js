const express = require("express");

const authController = require("../controllers/auth.controller");

const { authLimiter } = require("../../middleware/rateLimiter.middleware");
const validate = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");

const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken,
);

router.use(protect);
router.get("/me", authController.getMe);
router.post("/logout", authController.logout);
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  authController.changePassword,
);

module.exports = router;
