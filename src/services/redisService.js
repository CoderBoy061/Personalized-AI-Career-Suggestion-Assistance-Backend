import { createClient } from "redis";

const redisClient = createClient({
    url: "redis://redis:6379",
});

redisClient.on("error", (err) => console.error("❌ Redis error:", err));

const connectRedis = async () => {
    if (!redisClient.isOpen) {  // ✅ Already connected check
        await redisClient.connect();
        console.log("✅ Connected to Redis");
    } else {
        console.log("ℹ️ Redis already connected");
    }
};

export default { redisClient, connectRedis };
