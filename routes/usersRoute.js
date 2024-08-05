
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const JWT_SECRET = 'JWT_SECRET'; 

// Middleware to parse cookies
router.use(cookieParser());

// Route for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.send("User registered successfully");
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;


















// const express = require("express");
// const router = express.Router();
// const User = require("../models/userModel");

// // Route for user login
// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username, password });
//     if (user) {
//       res.send(user);
//     } else {
//       res.status(400).json({ error: "Invalid credentials" });
//     }
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// // Route for user registration
// router.post("/register", async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.send("User registered successfully");
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// module.exports = router;
