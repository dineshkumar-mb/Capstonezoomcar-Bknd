const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Car = require('../models/carModel');
router. use=(express.json()); // Middleware to parse JSON

// Route to fetch available cars based on date range
router.get('/cars', async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Please provide both from and to dates' });
  }

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
router.get('/reviews/:carId', async (req, res) => {
  const { carId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(carId)) {
    return res.status(400).json({ error: 'Invalid car ID format' });
  }

  try {
    const car = await Car.findById(carId).populate('reviews.userId', 'username');
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(car.reviews);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route for searching and filtering cars
router.get('/search', async (req, res) => {
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
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to get all cars
router.get('/getallcars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to add a new car
router.post('/addcar', async (req, res) => {
  const { name, image, rentPerHour, capacity, fuelType } = req.body;

  if (!name || !image || !rentPerHour || !capacity || !fuelType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newCar = new Car({
      Carname: name,
      Imageurl: image,
      RentPerHour: rentPerHour,
      Capacity: capacity,
      FuelType: fuelType
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to edit a car
router.put('/editcar/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid car ID format' });
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to delete a car
router.delete('/deletecar/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid car ID format' });
  }

  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
router.post('/rate/:carId', async (req, res) => {
  const { ratings, reviews } = req.body;
  const { carId } = req.params;

  console.log('Car ID:', carId);
  console.log('Request Body:', req.body); // Debugging log

  if (!ratings || !reviews) {
    return res.status(400).json({ error: "No records uploaded!" });
  }

  if (typeof ratings !== 'number' || ratings < 1 || ratings > 5) {
    return res.status(400).json({ error: 'Ratings must be a number between 1 and 5' });
  }

  if (typeof reviews !== 'string' || reviews.trim() === '') {
    return res.status(400).json({ error: 'Reviews must be a non-empty string' });
  }

  try {
    // Find the car by ID and push the new review and rating
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      {
        $push: {
          reviews: { ratings, reviews },  // Push new review object to the reviews array
          ratings: ratings                // Push new rating to the ratings array
        }
      },
      { new: true, useFindAndModify: false } // Return the updated document
    );

    if (!updatedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.status(200).json({ message: 'Review submitted successfully', car: updatedCar });
  } catch (error) {
    console.error('Error submitting review:', error); // Debugging log
    res.status(500).json({ error: 'An error occurred while submitting the review' });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Car = require('../models/carModel');
// const mongoose = require('mongoose'); // Import mongoose


// // Route to fetch available cars based on date range
// router.get('/cars', async (req, res) => {
//   const { from, to } = req.query;

//   try {
//     const cars = await Car.find({
//       'bookedTimeSlots.from': { $gte: new Date(from) },
//       'bookedTimeSlots.to': { $lte: new Date(to) }
//     });

//     res.json(cars);
//   } catch (error) {
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });
// // Route for fetching reviews
// router.get("/reviews/:carId", async (req, res) => {
//   const { carId } = req.params;

//   try {
//     const car = await Car.findById(carId).populate('reviews.userId', 'username');
//     if (!car) {
//       return res.status(404).json({ error: "Car not found" });
//     }

//     res.json(car.reviews);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });
// // Route for adding a reviews
// router.post("/addreviews", async (req, res) => {
//   const { carId, userId, ratings, comment } = req.body;

//   try {
//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({ error: "Car not found" });
//     }

//     const newreviews = { userId, ratings, comment };
//     car.reviews.push(newreviews);
//     await car.save();

//     res.send("reviews added successfully");
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });
// // Route for searching and filtering cars
// router.get("/search", async (req, res) => {
//   try {
//     const { category, minBudget, maxBudget } = req.query;

//     // Build the query object
//     let query = {};
//     if (category) query.category = category;
//     if (minBudget) query.rentPerHour = { $gte: minBudget };
//     if (maxBudget) {
//       query.rentPerHour = query.rentPerHour || {};
//       query.rentPerHour.$lte = maxBudget;
//     }

//     const cars = await Car.find(query);
//     res.json(cars);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });
// // Route to get all cars
// router.get('/getallcars', async (req, res) => {
//   try {
//     const cars = await Car.find();
//     res.status(200).json(cars);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Route to add a new car
// router.post('/addcar', async (req, res) => {
//   try {
//     const { name, image, rentPerHour, capacity, fuelType } = req.body;

//     // Validate the required fields
//     if (!name || !image || !rentPerHour || !capacity || !fuelType) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
// console.log(req.body)
//     const newCar = new Car({Carname: name,
//       Imageurl: image ,
//       RentPerHour: rentPerHour,
//       Capacity:capacity ,
//       FuelType: fuelType})
//     console.log(newCar)
//     await newCar.save();
   
//     res.status(201).json(newCar);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// // Route to edit a car
// router.put('/editcar/:id', async (req, res) => {
//   try {
//     const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedCar) {
//       return res.status(404).json({ error: 'Car not found' });
//     }
//     res.status(200).json(updatedCar);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Route to delete a car
// router.delete('/deletecar/:id', async (req, res) => {
//   try {
//     const deletedCar = await Car.findByIdAndDelete(req.params.id);
//     if (!deletedCar) {
//       return res.status(404).json({ error: 'Car not found' });
//     }
//     res.status(200).json({ message: 'Car deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Route to add a ratings and reviews
// router.post('/rate/:carId', async (req, res) => {
//   try {
//     const { carId } = req.params;
//     const { ratings, reviews, user } = req.body;

//     // Log the carId for debugging
//     console.log(`Adding ratings for carId: ${carId}`);

//     // Validate carId
//     if (!mongoose.Types.ObjectId.isValid(carId)) {
//       return res.status(400).json({ error: 'Invalid car ID format' });
//     }

//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({ error: 'Car not found' });
//     }

//     // Initialize ratings and reviews arrays if undefined
//     car.ratings = car.ratings || [];
//     car.reviews = car.reviews || [];

//     car.ratings.push(ratings);
//     car.reviews.push({ user, reviews, ratings });
//     await car.save();

//     res.status(200).json({ message: 'ratings and reviews added' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
