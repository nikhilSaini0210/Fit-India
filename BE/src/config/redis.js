const Redis = require("ioredis");
const logger = require("../utils/logger");
const { env } = require("./env");

let redisClient = null;
let bullConnection = null;

const createRedisInstance = () =>
  new Redis({
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password,

    maxRetriesPerRequest: 3,

    retryStrategy: (times) => {
      if (times > 5) {
        logger.error("Redis max retries exceeded");
        return null;
      }
      return Math.min(times * 200, 5000);
    },
    tls: {},
    lazyConnect: true,
    enableReadyCheck: true,
  });

const getRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createRedisInstance();

  redisClient.on("connect", () => logger.info("Redis connected"));
  redisClient.on("ready", () => logger.info("Redis ready"));
  redisClient.on("reconnecting", () => logger.warn("Redis reconnecting..."));
  redisClient.on("error", (err) =>
    logger.error("Redis error", { message: err.message }),
  );
  redisClient.on("close", () => logger.warn("Redis connection closed"));

  return redisClient;
};

const connectRedis = async () => {
  const client = getRedisClient();
  try {
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Redis timeout")), 5000),
      ),
    ]);

    return client;
  } catch (err) {
    logger.error("Redis connection failed", { message: err.message });
    return null;
  }
};

const getBullMQConnection = () => {
  if (bullConnection) return bullConnection;

  bullConnection = new Redis({
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password,
    tls: {},
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  bullConnection.on("error", (err) =>
    logger.error("BullMQ Redis error", { message: err.message }),
  );

  return bullConnection;
};

const disconnectRedis = async () => {
  try {
    if (redisClient) await redisClient.quit();
    if (bullConnection) await bullConnection.quit();

    logger.info("Redis connections closed");
  } catch (err) {
    logger.error("Error closing Redis", { message: err.message });
  }
};

module.exports = {
  getRedisClient,
  connectRedis,
  getBullMQConnection,
  disconnectRedis,
};
