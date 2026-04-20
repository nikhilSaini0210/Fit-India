const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
    issuer: "fitness-api",
    audience: "fitness-user",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
    issuer: "fitness-api",
    audience: "fitness-user",
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret, {
      issuer: "fitness-api",
      audience: "fitness-user",
    });
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.refreshSecret, {
      issuer: "fitness-api",
      audience: "fitness-user",
    });
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
};

const generateTokenPair = (userId, role = "user", tokenVersion = 0) => {
  const payload = {
    sub: userId,
    role,
    tv: tokenVersion,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateResetToken = () => crypto.randomBytes(32).toString("hex");

const hashPassword = async (password, saltRounds = 12) => {
  if (!password || typeof password !== "string") {
    throw new Error("Password is required and must be a string");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  if (!candidatePassword || !hashedPassword) {
    throw new Error("Both candidate and hashed password are required");
  }

  if (
    typeof candidatePassword !== "string" ||
    typeof hashedPassword !== "string"
  ) {
    throw new Error("Passwords must be strings");
  }

  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  hashToken,
  generateResetToken,
  hashPassword,
  comparePassword,
};
