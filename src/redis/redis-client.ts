import { createClient, type RedisClientOptions } from "@redis/client";
import "../configs/env";
const redisOptions: RedisClientOptions = {
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`
};

const redisClient = createClient(redisOptions);
redisClient.connect();
redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});


export default redisClient;
