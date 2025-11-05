require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");
const app = express();
const authRoutes = require("./routes/authRoute.js");
const sessionRoutes = require("./routes/sessionRoute.js");
const questionRoutes = require("./routes/questionRoute");
const cookieParser = require("cookie-parser");
const { protector } = require("./middleware.js/authMiddleware.js");
const {
  generateConceptExplanation,
  generateInterviewQuestions,
} = require("./controllers/aiControllers.js");
// Middleware to handle CORS
app.use(
  cors({
    origin: "https://qnify-frontend-code.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
connectDB();
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

app.post("/api/ai/generate-questions", generateInterviewQuestions);
app.post("/api/ai/generate-explanation", generateConceptExplanation);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
