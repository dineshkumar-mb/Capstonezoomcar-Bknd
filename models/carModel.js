const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
 Carname: { type: String  },
  Imageurl: { type: String},
  RentPerHour: { type: Number},
  Capacity: { type: Number},
  FuelType: { type: String},
 
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
