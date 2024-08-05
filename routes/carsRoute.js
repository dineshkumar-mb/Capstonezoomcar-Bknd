const express = require('express');
const router = express.Router();
const Car = require('../models/carModel');
// Route to fetch available cars based on date range
router.get('/cars', async (req, res) => {
  const { from, to } = req.query;

  try {
    const cars = await Car.find({
      'bookedTimeSlots.from': { $gte: new Date(from) },
      'bookedTimeSlots.to': { $lte: new Date(to) }
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Route for fetching reviews
router.get("/reviews/:carId", async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId).populate('reviews.userId', 'username');
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car.reviews);
  } catch (error) {
    res.status(400).json(error);
  }
});
// Route for adding a review
router.post("/addReview", async (req, res) => {
  const { carId, userId, rating, comment } = req.body;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const newReview = { userId, rating, comment };
    car.reviews.push(newReview);
    await car.save();

    res.send("Review added successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});
// Route for searching and filtering cars
router.get("/search", async (req, res) => {
  try {
    const { category, minBudget, maxBudget } = req.query;

    // Build the query object
    let query = {};
    if (category) query.category = category;
    if (minBudget) query.rentPerHour = { $gte: minBudget };
    if (maxBudget) {
      query.rentPerHour = query.rentPerHour || {};
      query.rentPerHour.$lte = maxBudget;
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});
// Route to get all cars
router.get('/getallcars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to add a new car
router.post('/addcar', async (req, res) => {
  try {
    const { name, image, rentPerHour, capacity, fuelType } = req.body;

    // Validate the required fields
    if (!name || !image || !rentPerHour || !capacity || !fuelType) {
      return res.status(400).json({ error: 'All fields are required' });
    }
console.log(req.body)
    const newCar = new Car({Carname: name,
      Imageurl: image ,
      RentPerHour: rentPerHour,
      Capacity:capacity ,
      FuelType: fuelType})
    console.log(newCar)
    await newCar.save();
   
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Route to edit a car
router.put('/editcar/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to delete a car
router.delete('/deletecar/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
