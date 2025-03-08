
import redisService from "../../services/redisService.js";

// Google Auth Controller
export const googleAuth = (req, res) => {
    const { token } = req.user;

    // ✅ Store JWT in Cookies
    res.cookie("token", token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Enable only in HTTPS (Production)
        sameSite: "Strict", // Restricts cross-site cookie access
    });

    // ✅ Redirect to Frontend after login
    res.redirect("http://localhost:3000/");
};

// Get User Controller
export const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ success: false, error: "Invalid token" });
        }
        const cachedContent = await redisService.redisClient.get(
            `user:${req.user._id}`
        );
        if (cachedContent) {
            return res
                .status(200)
                .json({ success: true, user: JSON.parse(cachedContent) });
        }
        // Cache the user data into the Redis
        const userKey = `user:${req.user._id}`; // Unique cache key for each user
        await redisService.redisClient.set(
            userKey,
            JSON.stringify(req.user),
            "EX",
            18000
        );
        res.json({ success: true, user: req.user });
    } catch (err) {
        res.status(403).json({ success: false, error: "Invalid token" });
    }
};

// update education controller
export const addEducation = async (req, res) => {
    try {
        const user = req.user;
        const { educationEntries } = req.body; // Expect an array of education objects

        // Check if educationEntries is provided and is an array
        if (!educationEntries || !Array.isArray(educationEntries)) {
            return res.status(400).json({ success: false, error: "Please provide an array of education entries" });
        }

        // Validate each education entry
        for (const entry of educationEntries) {
            const { institution, degree, fieldOfStudy, startYear, isCurrent } = entry;

            // Check for required fields in each entry
            if (!institution || !degree || !fieldOfStudy || !startYear || isCurrent === undefined) {
                return res.status(400).json({ success: false, error: "Please provide all required fields for each education entry" });
            }
        }

        // Add all education entries to the user's education array
        user.education.push(...educationEntries);
        // Save the user with the new education entries
        await user.save();
        return res.status(200).json({ success: true, message: "Education entries added successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}

// update profession controller

export const addProfession = async (req, res) => {
    try {
        const user = req.user;
        const { professionEntries } = req.body; // Expect an array of profession objects

        // Check if professionEntries is provided and is an array
        if (!professionEntries || !Array.isArray(professionEntries)) {
            return res.status(400).json({ success: false, error: "Please provide an array of profession entries" });
        }

        // Validate each profession entry
        for (const entry of professionEntries) {
            const { company, position, startDate, isCurrent } = entry;

            // Check for required fields in each entry
            if (!company || !position || !startDate || isCurrent === undefined) {
                return res.status(400).json({ success: false, error: "Please provide all required fields for each profession entry" });
            }
        }

        // Add all profession entries to the user's profession array
        user.profession.push(...professionEntries);
        // Save the user with the new profession entries
        await user.save();
        return res.status(200).json({ success: true, message: "Profession entries added successfully" });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
        
    }
}
// Logout Controller
export const logout = (_, res) => {
    try {
        // ✅ Clear Cookie
        res.clearCookie("token");

        // ✅ Redirect to Frontend after logout
        return res.redirect("http://localhost:3000/");

    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }
}
