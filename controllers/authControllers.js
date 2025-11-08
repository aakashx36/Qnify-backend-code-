const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel.js");

const registerUserLocal = async (req, res) => {
  const { fullName, email, password, profilepic } = req.body;
  console.log(req.body);
  const registeredUser = await User.findOne({ email });
  if (registeredUser) {
    return res.json({ message: "User already exists " });
  }
  //generatig salt
  const salt = bcrypt.genSaltSync(10);
  console.log("Generated Salt:", salt);

  // 3️⃣ Hash the password
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log("Hashed Password:", hashedPassword);
  const provider = "local";
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    profilepic,
    provider,
  });
  const token = jwt.sign({ id: user._id }, process.env.Jwt_Secret, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Only HTTPS in productionsameSite: 'lax',
    sameSite: none ,
    path: "/",
  });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    password: user.password,
    email: user.email,
    profilepic: user.profilepic,
  });
};

const logUserLocal = async (req, res) => {
  console.log("send successful to route");
  const { email, password } = req.body;
  const registeredUser = await User.findOne({ email });
  console.log(registeredUser);
  if (!registeredUser) {
    return res.json({ message: "User already exists " });
  }
  //check password is correct and email as provided

  const isPasswordMatch = await bcrypt.compare(
    password,
    registeredUser.password
  );
  // true
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Enter valid credentials" });
  }

  const token = jwt.sign({ id: registeredUser._id }, process.env.Jwt_Secret, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true , // Only HTTPS in production
    sameSite: none ,
    path: "/",
  });

  res.status(201).json({
    _id: registeredUser._id,
    fullName: registeredUser.fullName,
    password: registeredUser.password,
    email: registeredUser.email,
    profilepic: registeredUser.profilepic,
    token: jwt.sign({ id: registeredUser._id }, process.env.Jwt_Secret),
  });
};

const logOutUser = async (req, res) => {
  const COOKIE_NAME = "token"; // <--- Change this line!

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUserLocal,
  getUserProfile,
  logUserLocal,
  logOutUser,
};
