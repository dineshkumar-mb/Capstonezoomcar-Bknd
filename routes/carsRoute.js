const express = require('express');
const router = express.Router();
const Car = require('../models/carModel');

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
