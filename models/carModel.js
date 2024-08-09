
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Schema } = mongoose;

// Define the review schema
const reviewSchema = new Schema({
  ratings: { type: Number, required: true },
  reviews: { type: String, required: true } 
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



// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const reviewSchema = new Schema({
 
//   rating: { type: Number },
//   review: { type: String } // Add review to the schema
// });


// // Define the car schema
// const carSchema = new Schema({
//   Carname: { type: String, required: true },
//   Imageurl: { type: String, required: true },
//   RentPerHour: { type: Number, required: true },
//   Capacity: { type: Number, required: true },
//   FuelType: { type: String, required: true },
//   ratings: { type: [Number]},
//   reviews: { type: [reviewSchema]},
//   bookedTimeSlots: [{
//     from: { type: Date },
//     to: { type: Date }
//   }]
// });

// const Car = mongoose.model('Car', carSchema);
// module.exports = Car;




// range picker 

// const mongoose = require('mongoose');



// const carSchema = new mongoose.Schema({
//   ObjectId:{type:String},
//   Carname: { type: String, required: true },
//   Imageurl: { type: String, required: true },
//   RentPerHour: { type: Number, required: true },
//   Capacity: { type: Number, required: true },
//   FuelType: { type: String, required: true },
//   bookedTimeSlots: [
//     {
//       from: { type: Date, required: true },
//       to: { type: Date, required: true }
//     }
//   ],
//   ratings: [{type:Number}] ,
//  review:[{type:String}],
// });

// const Car = mongoose.model('Car', carSchema);

// module.exports = Car;

// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   comment: { type: String, required: true },
//   date: { type: Date, default: Date.now }
// });

// const carSchema = new mongoose.Schema({
//   Carname: { type: String },
//   Imageurl: { type: String },
//   RentPerHour: { type: Number },
//   Capacity: { type: Number },
//   FuelType: { type: String },
//   reviews: [reviewSchema] // Add reviews as an array of reviewSchema
// });

// const Car = mongoose.model('Car', carSchema);

// module.exports = Car;



