require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("aku", UserSchema);

// Register Route (Hash Password before Saving)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save user
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

app.listen(5000, () => console.log("Server running on port 5000"));
