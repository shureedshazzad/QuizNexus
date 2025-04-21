import Subject from "../models/subjectModel.js";
import User from "../models/userModel.js"
import Progress from "../models/progressModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create a new subject and initialize progress for all users
// @route   POST /api/create
// @access  Admin
const createSubject = asyncHandler(async (req, res) => {
  const { subjectName } = req.body;

  // Check if subject already exists
  const subjectExists = await Subject.findOne({ subjectName });
  if (subjectExists) {
    res.status(409);
    throw new Error("Subject already exists");
  }

  // Create new subject
  const subject = await Subject.create({ subjectName });

  // Get all users
  const users = await User.find({});

  // Create progress for each user (if not already exists)
  const progressPromises = users.map(async (user) => {
    const exists = await Progress.findOne({ user: user._id, subject: subject._id });
    if (!exists) {
      return Progress.create({ user: user._id, subject: subject._id });
    }
  });

  await Promise.all(progressPromises); // Wait for all progress creations

  res.status(201).json({
    message: "Subject created successfully and progress initialized for all users",
    subject,
  });
});



//@desc Get all subjects
//@route GET /api/subject
//@access Private
const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find();
    res.status(200).json({
        subjects
    });
})

// @desc    Delete a subject
// @route   DELETE /api/subjects/delete/:id
// @access  Admin
const deleteSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findById(id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  await subject.deleteOne(); // ✅ delete once
  res.status(200).json({
    message: "Subject deleted successfully",
  });
});


//@desc view a progress for a specific userId and subjectId
//@route GET /api/
//@access Private
const viewProgress = asyncHandler(async (req, res) => {
    const { userId, subjectId } = req.query;
  
    if (!userId || !subjectId) {
      res.status(400);
      throw new Error("userId or subjectId is missing");
    }
  
    const progress = await Progress.findOne({
      user: userId,
      subject: subjectId,
    })
      .populate('subject', 'subjectName') // get subjectName from Subject schema
      .populate('user', 'userName avatar');   // get name and avatar from User schema
  
    if (!progress) {
      res.status(404);
      throw new Error("Progress not found for this subject and user");
    }
  
    res.status(200).json(progress);
  });
  



export{
    createSubject,
    getSubjects,
    deleteSubject,
    viewProgress
}