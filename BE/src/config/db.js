const mongoose = require("mongoose");
const logger = require("../utils/logger");
const { env } = require("./env");

mongoose.set("strictQuery", true);

let isConnected = false;

const connectDB = async (retries = 5) => {
  try {
    if (isConnected) return;

    const conn = await mongoose.connect(env.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connection established");
    });

    mongoose.connection.on("connecting", () => {
      logger.info("MongoDB connecting...");
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      logger.warn("MongoDB disconnected. Attempting reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      isConnected = true;
      logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB error", { message: err.message });
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    if (retries > 0) {
      logger.warn(`Retrying DB connection... (${retries} left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (err) {
    logger.error("Error closing MongoDB connection", {
      message: err.message,
    });
  }
};

module.exports = { connectDB, disconnectDB };
