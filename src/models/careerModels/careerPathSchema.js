import mongoose from "mongoose";

const CareerPathSchema = new mongoose.Schema({
    careerName: { type: String, required: true, unique: true },
    chapters: [{
        title: { type: String, required: true },
        subtopics: [{
            title: { type: String, required: true },
            description: { type: String, required: true },
        }],
        resources: [{ type: String, required: true }]
    }]
}, { timestamps: true });

const CareerPath = mongoose.model("CareerPath", CareerPathSchema);

export default CareerPath;
