import IORedis from "ioredis";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

const redisUrl = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PWD;

if (!redisUrl) {
  throw new Error("NO REDIS_DATABASE FOUND");
}

const redis = new IORedis(redisUrl, {
  password: redisPassword,
});

redis.on("connect", () => {
  console.log("🟢 Connected to Cloud Redis");
});

redis.on("error", (err) => {
  console.error("🔴 Cloud Redis Error:", err);
  return error;
});

export default redis;
