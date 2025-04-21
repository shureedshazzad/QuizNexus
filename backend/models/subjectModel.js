import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    unique: true, // prevent duplicates like "Math" and "math"
  }
}, {
  timestamps: true,
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;