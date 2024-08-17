
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Schema } = mongoose;

// Define the review schema
const reviewSchema = new Schema({
  ratings: { type: Number},
  reviews: { type: String } 
});

// Define the car schema

const carSchema = new Schema({
  Carname: { type: String, required: true },
  Imageurl: { type: String, required: true },
  RentPerHour: { type: Number, required: true },
  Capacity: { type: Number, required: true },
  FuelType: { type: String, required: true },
  ratings: { type: [Number] },  // Array of numbers
  reviews: { type: [reviewSchema] },  // Array of reviewSchema objects
  bookedTimeSlots: [{
    from: { type: Date },
    to: { type: Date }
  }]
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;





