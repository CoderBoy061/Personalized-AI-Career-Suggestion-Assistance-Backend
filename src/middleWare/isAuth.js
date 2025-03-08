import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModels/userSchema.js";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.userId);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}