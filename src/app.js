import express from "express";
import cors from "cors";
import MongoService from "./services/mongoService.js";
import cookieParser from "cookie-parser";
import "./services/passportService.js";
// ======================================user routes ==========================================
import userRoutes from "./routes/userRoutes/userRoute.js";
import careerRoutes from "./routes/careerRoutes/careerRoute.js";

const app = express();
app.use(cookieParser()); // Parse cookies from incoming requests
// await redisService.connectRedis();
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"], credentials: true }));
app.use(express.json());


// Routes Middleware
app.use("/api/auth", userRoutes);
app.use("/api/career", careerRoutes);

//================================= Database connection service===============================
MongoService();


// Test route
app.get("/", (_, res) => {
  res.send("Hello Boss, don't try to hack me...........................");
});

export default app;
