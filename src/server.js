import http from "http";
const PORT = process.env.PORT || 5000;
import app from "./app.js";
// Create HTTP server
const server = http.createServer(app);

import redisService from "./services/redisService.js";

// Start the server
redisService.connectRedis().then(() => {
    console.log("✅ Redis Connected Successfully");
    // Start server after Redis is ready
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("❌ Redis Connection Failed:", err);
  });