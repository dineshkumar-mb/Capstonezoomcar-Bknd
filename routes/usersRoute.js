// added user id and role 



const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Car = require("../models/carModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

// Middleware to verify token and check if the user is an admin
const verifyTokenAndAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Access denied.');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).send('Access denied. Admins only.');
    }
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

// Route for user login
// Route for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please provide both username and password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Route for user registration
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please provide both username and password" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, password: hashedPassword, role: 'User' });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Admin login route
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please provide both username and password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Admin login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Admin route to add a car
router.post("/admin/addcar", verifyTokenAndAdmin, async (req, res) => {
  const { name, image, rentPerHour, capacity, fuelType } = req.body;

  if (!name || !image || !rentPerHour || !capacity || !fuelType) {
    return res.status(400).json({ error: "Please provide all car details" });
  }

  try {
    const newCar = new Car({ name, image, rentPerHour, capacity, fuelType });
    await newCar.save();
    res.json({ message: "Car added successfully" });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Admin route to edit a car
router.put("/admin/editcar/:id", verifyTokenAndAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, image, rentPerHour, capacity, fuelType } = req.body;

  if (!name || !image || !rentPerHour || !capacity || !fuelType) {
    return res.status(400).json({ error: "Please provide all car details" });
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { name, image, rentPerHour, capacity, fuelType },
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Admin route to delete a car
router.delete("/admin/deletecar/:id", verifyTokenAndAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;



