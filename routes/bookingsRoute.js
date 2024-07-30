
const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("sk_test_51PfEQKIGMXT0myEMkagrj8DFPcRe6TrgyUEHkBXkCWL8ud3LOgMcXScv7OrkPiK5GVwtrpOxB7x69k9KE53ymQhc00aHl587y3");

// Route to book a car
router.post("/bookings/bookingcar", async (req, res) => {
  const { token, totalAmount, car, bookedTimeSlots } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      req.body.transactionId = payment.source.id;
      const newBooking = new Booking(req.body);
      await newBooking.save();

      const carToUpdate = await Car.findById(car);
      carToUpdate.bookedTimeSlots.push(bookedTimeSlots);
      await carToUpdate.save();

      res.send("Your booking is successful");
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

// Route to get all bookings
router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car');
    res.send(bookings);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});
// Cancellation Logic
router.delete("/cancelbooking",async (req,res)=>{
  try {
    const bookingId = req.params.id;

    // Find the booking by ID
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the car's bookedTimeSlots (optional)
    const car = await Car.findById(booking.car);
    car.bookedTimeSlots = car.bookedTimeSlots.filter(
      (slot) => slot !== booking.bookedTimeSlots
    );
    await car.save();

    res.status(200).send("Booking canceled successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }});

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/bookingModel");
// const Car = require("../models/carModel");
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")("sk_test_51PfEQKIGMXT0myEMkagrj8DFPcRe6TrgyUEHkBXkCWL8ud3LOgMcXScv7OrkPiK5GVwtrpOxB7x69k9KE53ymQhc00aHl587y3");

// // Route to book a car
// router.post("/bookcar", async (req, res) => {
//   const { token, totalAmount, car, bookedTimeSlots } = req.body;
//   try {
//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id,
//     });

//     const payment = await stripe.charges.create(
//       {
//         amount: totalAmount * 100,
//         currency: "inr",
//         customer: customer.id,
//         receipt_email: token.email,
//       },
//       {
//         idempotencyKey: uuidv4(),
//       }
//     );

//     if (payment) {
//       req.body.transactionId = payment.source.id;
//       const newBooking = new Booking(req.body);
//       await newBooking.save();

//       const carToUpdate = await Car.findById(car);
//       carToUpdate.bookedTimeSlots.push(bookedTimeSlots);
//       await carToUpdate.save();

//       res.send("Your booking is successful");
//     } else {
//       res.status(400).json({ error: "Payment failed" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: "Something went wrong" });
//   }
// });

// // Route to get all bookings
// router.get("/getallbookings", async (req, res) => {
//   try {
//     const bookings = await Booking.find().populate('car');
//     res.send(bookings);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: "Something went wrong" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/bookingModel");
// const Car = require("../models/carModel");
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")('sk_test_51PfEQKIGMXT0myEMkagrj8DFPcRe6TrgyUEHkBXkCWL8ud3LOgMcXScv7OrkPiK5GVwtrpOxB7x69k9KE53ymQhc00aHl587y3'); // Replace with your secret key

// // Route to book a car
// router.post("/bookings", async (req, res) => {
//   const { totalAmount, car, bookedTimeSlots,email,id,token } = req.body;
// console.log("token",token)
//   try {
//     // Validate input data (implement your validation logic here)

//     const customer = await stripe.customers.create({
//       email: token.email,
//       source:token. id,
//     });

//     const payment = await stripe.charges.create({
//       amount: totalAmount * 100,
//       currency: "INR",
//       customer: customer.id,
//       receipt_email:email,
//     }, {
//       idempotencyKey: uuidv4(),
//     });

//     if (payment) {
//       req.body.transactionId = payment.source.id;

//       // Check car availability before saving the booking (optional)

//       const newBooking = new Booking(req.body);
      
//       await newBooking.save();

//       const carToUpdate = await Car.findById(car);
//       carToUpdate.bookedTimeSlots.push(bookedTimeSlots);
//       await carToUpdate.save();

//       res.send("Your booking is successful");
//     } else {
//       res.status(400).json({ error: "Payment failed" });
//     }
//   } catch (error) {
//     if (error.name === 'ValidationError') { // Handle Mongoose validation errors
//       return res.status(400).json({ error: error.message });
//     }
//     console.error(error);
//     res.status(400).json({ error: " wrong!" });
//   }
// });

// // ... other routes (unaltered)

// module.exports = router;
