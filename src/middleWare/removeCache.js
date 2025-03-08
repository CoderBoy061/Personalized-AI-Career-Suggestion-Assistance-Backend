import redisService from "../services/redisService.js";
 // Middleware to clear Redis cache on update
const clearCacheMiddleware = (req, res, next) => {
    // Check if the request method is an update operation (PUT, PATCH, POST, DELETE)
    if (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'POST' || req.method === 'DELETE') {
        const userId = req.user.id; // Assuming the user ID is available in the request
        const cacheKey = `user:${userId}`; // Define the Redis cache key

        // Clear the cache for the specific key
        redisService.redisClient.del(cacheKey, (err, response) => {
            if (err) {
                console.error("Error clearing Redis cache:", err);
            } else {
                console.log(`Cache cleared for key: ${cacheKey}`);
            }
        });
    }

    // Proceed to the next middleware or route handler
    next();
};

export default clearCacheMiddleware;