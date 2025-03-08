import openAi from "../../services/openAi.js";
import redisService from "../../services/redisService.js";
import Career from "../../models/careerModels/career.js";
import CareerPath from "../../models/careerModels/careerPathSchema.js";
import UserProgress from "../../models/careerModels/userProgress.js";
import {
    parseCareerData
} from "../../utils/parseCareer.js";

// get alll careers options

export const getAllCareers = async (req, res) => {
    try {
        const user = req.user; // getting the user from the request
        // Check if education and profession arrays are empty
        if (
            (!user.education || user.education.length === 0) &&
            (!user.profession || user.profession.length === 0)
        ) {
            return res.status(400).json({
                success: false,
                error:
                    "Please add your education and profession details first to get your personalized career details",
            });
        }

        // Check if career suggestions are already cached
        const cachedData = await redisService.redisClient.get(`career:${user._id}`);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedData),
            });
        }
        // Format education and profession data for the OpenAI API
        const educationDetails = user.education
            .map(
                (edu) => `${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}`
            )
            .join(", ");

        const professionDetails = user.profession
            .map((prof) => `${prof.title} at ${prof.company}`)
            .join(", ");

        // Call OpenAI API
        // const response = await openAi.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         { role: "system", content: "You are a career guidance assistant." },
        //         {
        //             role: "user",
        //             content: `Suggest career paths for someone with ${educationDetails} education and experience in ${professionDetails} and also provide resource links, salary range, recomended certifications, skills required for this career and return the data in a structured format, so that it can be saved in the database. Make sure to add the resources, salary range, recomended certifications, skills required for the career path together, do not send separetly. Please send the data in json format.`,
        //         },
        //     ],
        // });
        const response = await openAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a career guidance assistant." },
                {
                    role: "user",
                    content: `Suggest career paths for someone with ${educationDetails} education and experience in ${professionDetails}. 
                    Provide the response in the following JSON format:
                    {
                        "careerPaths": [
                            {
                                "title": "Career Title",
                                "description": "Brief description of the career path",
                                "skillsRequired": ["Skill 1", "Skill 2", "Skill 3"],
                                "recommendedCertifications": ["Certification 1", "Certification 2"],
                                "salaryRange": "Expected salary range (e.g., $50,000 - $80,000 per year)",
                                "resourceLinks": [
                                    {
                                        "name": "Resource Name",
                                        "url": "https://resource-link.com"
                                    }
                                ]
                            }
                        ]
                    }
                    Ensure that the response strictly follows this structure, keeping the field names consistent.`,
                },
            ],
        });
        const careerSuggestions = response.choices[0].message.content;
        if (!careerSuggestions) {
            return res.status(400).json({
                success: false,
                error: "No career suggestions found",
            });
        }
        const careers = parseCareerData(careerSuggestions);
        // Save career suggestions to the database for future reference
        const careerPaths = careers?.careerPaths || [];
        const insertedData = [];



        for (const career of careerPaths) {
            // Map the response fields to the Career schema
            const newCareer = new Career({
                title: career?.title,
                description: career?.description,
                skills: career?.skillsRequired,
                salaryRange: career?.salaryRange,
                certifications: career?.recommendedCertifications,
                resources: career?.resourceLinks, // Extract links from resources
            });

            // Save the career path to the database
            const savedCareer = await newCareer.save()
            insertedData.push(savedCareer);
        }

        if (insertedData && insertedData.length > 0) {
            // // add the data into the cache
            await redisService.redisClient.set(
                `career:${user._id}`,
                JSON.stringify(insertedData),
                "EX",
                18000
            );
        }

        return res
            .status(200)
            .json({ success: true, data: insertedData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const getCarriedGuide = async (req, res) => {
    try {
        const { id } = req.params;

        const cachedGuide = await redisService.redisClient.get(`career_guide:${id}`);
        if (cachedGuide) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedGuide) });
        }
        const career = await Career.findById(id);
        if (!career) {
            return res.status(404).json({ success: false, error: "Career not found" });
        }

        // if we found the path , now fetch the guide details chaper wise based on that path

        const prompt = `
        Generate a structured career guide for "${career?.title}" with the following format:
        - Title: [Chapter Name]
        - Subtopics: [{ title, description }]
        - Resources: [List of URLs]
        Follow this JSON format strictly:
        {
            "careerName": "${career?.title}",
            "chapters": [
                {
                    "title": "Introduction to ${career?.title}",
                    "subtopics": [
                        { "title": "What is ${career?.title}?", "description": "Brief overview" },
                        { "title": "Roles and Responsibilities", "description": "Common tasks and duties" },
                        { "title": "Career Outlook", "description": "Market demand and growth" }
                    ],
                    "resources": [
                        "https://www.example.com",
                        "https://www.example2.com"
                    ]
                },
                {
                    "title": "Education and Skills",
                    "subtopics": [
                        { "title": "Degree Options", "description": "Relevant education paths" },
                        { "title": "Certifications", "description": "Industry certifications" },
                        { "title": "Technical Skills", "description": "Required programming languages and tools" }
                    ],
                    "resources": [
                        "https://www.example.com",
                        "https://www.example2.com"
                    ]
                }
            ]
        }
    `;
        // Call OpenAI API
        const response = await openAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a career guidance assistant." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const careerGuide = response.choices[0].message.content;

        if (!careerGuide) {
            return res.status(400).json({ success: false, error: "No career guide found" });
        }
        const parsedCareerGuide = parseCareerData(careerGuide);
        const careerPaths = parsedCareerGuide?.chapters || [];
        const newCareerPath = new CareerPath({
            careerName: career?.title,
            chapters: careerPaths.map(chapter => ({
                title: chapter.title,
                subtopics: chapter.subtopics.map(subtopic => ({
                    title: subtopic.title,
                    description: subtopic.description
                })),
                resources: chapter.resources
            }))
        });
        const savedCareerPath = await newCareerPath.save();

        // insert the data into the cache memory
        await redisService.redisClient.set(
            `career_guide:${id}`,
            JSON.stringify(savedCareerPath),
            "EX",
            18000
        );

        return res.status(200).json({ success: true, data: savedCareerPath });


    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error: "Server Error" });
    }
}


// Function to start pursuing a career path
export const startPursuingCareer = async (req, res) => {
    try {
        // need to pass the career path id from the frontend
        const { careerPathId } = req.body;
        const userId = req.user._id;
        let userProgress = await UserProgress.findOne({ userId, careerPathId });

        if (!userProgress) {
            // Initialize progress
            const careerPath = await CareerPath.findById(careerPathId);
            if (!careerPath) {
                return res.status(404).json({ message: "Career path not found" });
            }

            userProgress = new UserProgress({
                userId,
                careerPathId,
                pursuing: true,
                progress: careerPath.chapters.map(chapter => ({
                    chapterId: chapter._id,
                    completed: false,
                    subtopics: chapter.subtopics.map(subtopic => ({
                        subtopicId: subtopic._id,
                        completed: false
                    }))
                }))
            });

            await userProgress.save();
        } else {
            userProgress.pursuing = true;
            await userProgress.save();
        }

        // Cache progress in Redis
        await redisService.redisClient.set(`userProgress:${userId}:${careerPathId}`, JSON.stringify(userProgress), "EX", 3600);

        res.status(200).json({ message: "Started pursuing career path", data: userProgress });
    } catch (error) {
        res.status(500).json({ message: "Error starting career path", error: error.message });
    }
};

// Function to update chapter progress
export const markChapterCompleted = async (req, res) => {
    try {
        const { careerPathId, chapterId } = req.body;
        const userId = req.user._id;
        let userProgress = await UserProgress.findOne({ userId, careerPathId });

        if (!userProgress) {
            return res.status(404).json({ message: "Progress not found. Start pursuing the career first." });
        }

        // Find the specific chapter
        const chapter = userProgress.progress.find(chap => chap.chapterId.toString() === chapterId);
        if (chapter) {
            chapter.completed = true;
            chapter.subtopics.forEach(sub => (sub.completed = true)); // Mark all subtopics as completed
        }

        await userProgress.save();

        // Update Redis cache
        await redisService.redisClient.set(`userProgress:${userId}:${careerPathId}`, JSON.stringify(userProgress), "EX", 3600);

        res.status(200).json({ message: "Chapter marked as completed", data: userProgress });
    } catch (error) {
        res.status(500).json({ message: "Error updating chapter progress", error: error.message });
    }
};

// Function to update subtopic progress
export const markSubtopicCompleted = async (req, res) => {
    try {
        const {
            careerPathId, chapterId, subtopicId } = req.body;
        const userId = req.user._id;

        let userProgress = await UserProgress.findOne({ userId, careerPathId });

        if (!userProgress) {
            return res.status(404).json({ message: "Progress not found. Start pursuing the career first." });
        }

        // Find the chapter and subtopic
        const chapter = userProgress.progress.find(chap => chap.chapterId.toString() === chapterId);
        if (chapter) {
            const subtopic = chapter.subtopics.find(sub => sub.subtopicId.toString() === subtopicId);
            if (subtopic) {
                subtopic.completed = true;
            }
        }

        await userProgress.save();

        // Update Redis cache
        await redisService.redisClient.set(`userProgress:${userId}:${careerPathId}`, JSON.stringify(userProgress), "EX", 3600);

        res.status(200).json({ message: "Subtopic marked as completed", data: userProgress });
    } catch (error) {
        res.status(500).json({ message: "Error updating subtopic progress", error: error.message });
    }
};

// Function to get user progress
export const getUserProgress = async (req, res) => {
    try {
        const { careerPathId } = req.params;
        const userId = req.user._id;

        // Check Redis cache first
        const cachedProgress = await redisService.redisClient.get(`userProgress:${userId}:${careerPathId}`);
        if (cachedProgress) {
            return res.status(200).json({ message: "User progress retrieved from cache", data: JSON.parse(cachedProgress) });
        }

        // Fetch from DB if not cached
        const userProgress = await UserProgress.findOne({ userId, careerPathId }).populate("progress.chapterId progress.subtopics.subtopicId");

        if (!userProgress) {
            return res.status(404).json({ message: "No progress found for this user and career path" });
        }

        // Store in Redis for future requests
        await redisService.redisClient.set(`userProgress:${userId}:${careerPathId}`, JSON.stringify(userProgress), "EX", 3600);

        res.status(200).json({ message: "User progress retrieved", data: userProgress });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving progress", error: error.message });
    }
};
