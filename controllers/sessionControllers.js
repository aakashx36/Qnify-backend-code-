const sessionSchema = require("../model/sessionModel");
const questionSchema = require("../model/questionModel");

const createSession = async (req, res) => {
  //try {
  const { role, experience, topicsToFocus, description, questions } = req.body;
  const userId = req.user; // Assuming you have a middleware setting req.user
  const session = await sessionSchema.create({
    user: userId,
    role,
    experience,
    topicsToFocus,
    description,
  });

  const questionDocs = await Promise.all(
    questions.map(async (q) => {
      const question = await questionSchema.create({
        session: session._id,
        question: q.question,
        answer: q.answer,
      });
      return question._id;
    })
  );
  session.questions = questionDocs;
  await session.save();

  res.status(201).json({
    success: true,
    message: "Session created successfully",
    session,
  });
  //} //catch (error) {
  //res.status(500).json({ success: false, message: "Server Error" });
  //}
};

const getSessionById = async (req, res) => {
  try {
    const session = await sessionSchema
      .findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSession = async (req, res) => {
  try {
    console.log(req.user);

    const sessions = await sessionSchema
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");
    console.log(sessions);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await sessionSchema.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if the logged-in user owns this session
    if (session.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this session" });
    }

    // First, delete all questions linked to this session
    await questionSchema.deleteMany({ session: session._id });

    // Then, delete the session
    await session.deleteOne();

    res.status(200).json({ message: "Session deleted successfulty" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createSession, getSessionById, getSession, deleteSession };
