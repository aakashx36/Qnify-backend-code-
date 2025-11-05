const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import the v4 function

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  note: String,
  Session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
});

module.exports = mongoose.model("Question", questionSchema);
