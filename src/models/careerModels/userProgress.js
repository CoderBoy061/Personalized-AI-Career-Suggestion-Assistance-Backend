import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    careerPathId: { type: mongoose.Schema.Types.ObjectId, ref: "CareerPath", required: true },
    pursuing: { type: Boolean, default: false }, // Whether the user wants to pursue this career
    progress: [
      {
        chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "CareerPath.chapters", required: true },
        completed: { type: Boolean, default: false }, // Track if the chapter is done
        subtopics: [
          {
            subtopicId: { type: mongoose.Schema.Types.ObjectId, required: true },
            completed: { type: Boolean, default: false }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

export default UserProgress;
