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
      if (!carToUpdate) {
        return res.status(404).json({ error: "Car not found" });
      }

      carToUpdate.bookedTimeSlots.push(bookedTimeSlots);
      await carToUpdate.save();

      res.send("Your booking is successful");
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Route to get all bookings
router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car');
    res.send(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Update booking
router.put("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Cancellation Logic
router.delete("/delete/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const car = await Car.findById(booking.car);
    car.bookedTimeSlots = car.bookedTimeSlots.filter(
      slot => !(
        slot.from === booking.bookedTimeSlots.from && 
        slot.to === booking.bookedTimeSlots.to
      )
    );
    await car.save();

    res.status(200).send("Booking canceled successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const Booking = require("../models/bookingModel");
// // const Car = require("../models/carModel");
// // const { v4: uuidv4 } = require("uuid");
// // const stripe = require("stripe")("sk_test_51PfEQKIGMXT0myEMkagrj8DFPcRe6TrgyUEHkBXkCWL8ud3LOgMcXScv7OrkPiK5GVwtrpOxB7x69k9KE53ymQhc00aHl587y3");

// // // Route to book a car
// // router.post("/bookings/bookingcar", async (req, res) => {
// //   const { token, totalAmount, car, bookedTimeSlots } = req.body;
// //   try {
// //     const customer = await stripe.customers.create({
// //       email: token.email,
// //       source: token.id,
// //     });

// //     const payment = await stripe.charges.create(
// //       {
// //         amount: totalAmount * 100,
// //         currency: "INR",
// //         customer: customer.id,
// //         receipt_email: token.email,
// //       },
// //       {
// //         idempotencyKey: uuidv4(),
// //       }
// //     );
    
// //         if (payment) {
// //           // Add transaction ID to the request body
// //           req.body.transactionId = payment.source.id;
    
// //           // Create a new booking
// //           const newBooking = new Booking(req.body);
// //           await newBooking.save();
    
// //           // Update the car's booked time slots
// //           const carToUpdate = await Car.findById(car);
// //           if (!carToUpdate) {
// //             return res.status(404).json({ error: "Car not found" });
// //           }
// //           if (!Array.isArray(carToUpdate.bookedTimeSlots)) {
// //             carToUpdate.bookedTimeSlots = [];
// //           }
// //           carToUpdate.bookedTimeSlots.push(bookedTimeSlots);
// //           await carToUpdate.save();
    
// //           // Send success response
// //           res.send("Your booking is successful");
// //         } else {
// //           // Handle payment failure
// //           res.status(400).json({ error: "Payment failed" });
// //         }
// //       } catch (error) {
// //         // Log the error and send a response
// //         console.error(error);
// //         res.status(500).json({ error: "Something went wrong" });
// //       }
// //     });
    

// // // Route to get all bookings
// // router.get("/getallbookings", async (req, res) => {
// //   try {
// //     const bookings = await Booking.find().populate('car');
// //     res.send(bookings);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(400).json({ error: "Something went wrong" });
// //   }
// // });
// // // Cancellation Logic
// // router.delete('/cancelbooking/:id', async (req, res) => {

// //   try {
// //     const bookingId = req.params.id;
// //     // Assuming you have a Booking model
// //     await Booking.findByIdAndDelete(bookingId);
// //     res.status(200).json({ message: 'Booking deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });


// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/bookingModel");
// const Car = require("../models/carModel");
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")("sk_test_51PfEQKIGMXT0myEMkagrj8DFPcRe6TrgyUEHkBXkCWL8ud3LOgMcXScv7OrkPiK5GVwtrpOxB7x69k9KE53ymQhc00aHl587y3");

// // Route to book a car
// router.post("/bookings/bookingcar", async (req, res) => {
//   const { token, totalAmount, car, bookedTimeSlots } = req.body;
//   try {
//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id,
//     });

//     const payment = await stripe.charges.create(
//       {
//         amount: totalAmount * 100,
//         currency: "INR",
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
//       if (!carToUpdate) {
//         return res.status(404).json({ error: "Car not found" });
//       }

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
// //update logic
// router.put(`/bookings/:id`, async (req, res) => {
//   console.log(req.params.id)
//   try {
//     const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
//     res.status(200).send(booking);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Cancellation Logic
// router.delete(`/delete/:id`,async (req,res)=>{
//   try {
//     console.log(req.params.id)
//     const bookingId = req.params.id;

//     // Find the booking by ID
//     const booking = await Booking.findByIdAndDelete(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Update the car's bookedTimeSlots (optional)
//     const car = await Car.findById(booking.car);
//     // car.bookedTimeSlots = car.bookedTimeSlots.filter(
//     //   (slot) => slot !== booking.bookedTimeSlots
//     // );
//     await car.save();

//     res.status(200).send("Booking canceled successfully");
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }});

// module.exports = router;
