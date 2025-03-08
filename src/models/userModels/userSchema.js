import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: false }, // For Google OAuth
  avatar: { type: String, required: false },
  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String, required: true },
      startYear: { type: Number, required: true },
      endYear: { type: Number },
      isCurrent: { type: Boolean, required: true },
    },
  ],
  profession: [
    {
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      isCurrent: { type: Boolean, required: true },
    },
  ],
},{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
