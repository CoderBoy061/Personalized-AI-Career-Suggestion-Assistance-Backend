import mongoose from "mongoose";

const careerSchema = mongoose.Schema({
    title: { type: String, required: true }, // Career title (e.g., "Software Developer")
    description: { type: String, required: true }, // Career description
    skills: { type: [String], default: [] }, // Required skills for the career
    salaryRange: { type: String }, // Salary range (e.g., "$80,000–$120,000")
    certifications: { type: [String], default: [] }, // Recommended certifications
    resources: [{ name: String, url: String }], // Links to learning materials
});

const Career = mongoose.model("Career", careerSchema);

export default Career;
