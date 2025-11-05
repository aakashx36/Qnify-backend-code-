const express = require("express");
const router = express.Router();
const uploadMidleware = require("../middleware.js/uploadMidleware");
const { protector } = require("../middleware.js/authMiddleware");

// Import all controller functions
const {
  registerUserLocal,
  getUserProfile,
  logUserLocal,
  logOutUser,
} = require("../controllers/authControllers");
// --- Fix 1: The controller function is the second argument ---
router.post("/register", registerUserLocal);
router.post("/login", logUserLocal);
router.post("/logout", logOutUser);
// --- Fix 2: Corrected typo 'getUserPrfile' -> 'getUserProfile' ---
router.get("/profile", protector, getUserProfile);
router.post("/uploads", uploadMidleware, (req, res) => {
  try {
    // Multer-storage-cloudinary adds the Cloudinary response to `req.file`.
    // The `secure_url` is the public HTTPS URL of the uploaded image.
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const imageUrl = req.file.path; // Or req.file.secure_url

    // Respond to the client with the image URL
    res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "An error occurred during upload." });
  }
});
// --- Fix 3: Use CommonJS module.exports ---
module.exports = router;
