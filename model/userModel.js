const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users have the same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // <-- This is the key! Nullable.
    },
    profilepic: {
      type: String,
      required: false,
      default: null,
    },
    provider: {
      type: String,
      required: true,
      enum: ["local", "google"], // Only allows these two values
      default: "local",
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
