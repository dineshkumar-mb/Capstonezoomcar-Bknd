const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")("sk_test_51PfEQKIGMXT0myEMkagrj8DFPcRe6TrgyUEHkBXkCWL8ud3LOgMcXScv7OrkPiK5GVwtrpOxB7x69k9KE53ymQhc00aHl587y3");
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
// Route to book a car
router.post("/bookingcar", async (req, res) => {
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

// Route to get bookings for a specific user
router.get("/userbookings", async (req, res) => {
  try {
    let userId = req.query.userId;

    // Prefer extracting userId from JWT token (most reliable source)
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      try {
        const decoded = jwt.verify(authHeader, JWT_SECRET);
        if (decoded && decoded.userId) {
          userId = decoded.userId;
        }
      } catch (e) {
        // Token invalid or expired — fall back to query param
      }
    }

    if (!userId || userId === "undefined" || userId === "null") {
      return res.status(400).json({ error: "userId is required" });
    }

    const bookings = await Booking.find({ user: userId }).populate('car');
    res.send(bookings);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid userId format" });
    }
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

    // Only clean up car's booked slots if the car reference exists
    if (booking.car) {
      const car = await Car.findById(booking.car);
      if (car) {
        car.bookedTimeSlots = car.bookedTimeSlots.filter(
          slot => !(
            slot.from === booking.bookedTimeSlots.from &&
            slot.to === booking.bookedTimeSlots.to
          )
        );
        await car.save();
      }
    }

    res.status(200).send("Booking canceled successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;

