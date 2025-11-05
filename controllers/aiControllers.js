const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompt"); // Assuming conceptExplainPrompt is also needed later
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);
console.log(ai);
// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );
    // ---- FIX: Get the specific model instance first ---
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); // Or "gemini-pro"
    console.log(model);
    // --- FIX: Call generateContent on the model instance ---
    const result = await model.generateContent(prompt);

    // Access the response correctly
    const response = await result.response;
    let rawText = response.text();
    // Clean potentially problematic markdown/text around the JSON
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json (optional whitespace)
      .replace(/\s*```$/, "") // Remove ending ``` (optional whitespace)
      .trim(); // Remove leading/trailing whitespace

    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explains a interview question
// ... (rest of the file)

// @desc    Generate explains a interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    // ---- FIX: Get the specific model instance first ---
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); // Or "gemini-pro"
    console.log(model);
    // --- FIX: Call generateContent on the model instance ---
    const result = await model.generateContent(prompt);

    // Access the response correctly
    const response = await result.response;

    let rawText = response.text();

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/\s*```$/, "") // remove ending ```
      .trim(); // remove extra spaces

    // Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
