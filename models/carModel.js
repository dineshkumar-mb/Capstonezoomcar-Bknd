// range picker 
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const carSchema = new mongoose.Schema({
  Carname: { type: String, required: true },
  Imageurl: { type: String, required: true },
  RentPerHour: { type: Number, required: true },
  Capacity: { type: Number, required: true },
  FuelType: { type: String, required: true },
  bookedTimeSlots: [
    {
      from: { type: Date, required: true },
      to: { type: Date, required: true }
    }
  ],
  reviews: [reviewSchema] // Add reviews as an array of reviewSchema
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

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



