const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    bookedTimeSlots: {
      from: { type: String, required: true },
      to: { type: String, required: true }
    },
    totalHours: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    RentPerHour: { type: Number, required: true },
    transactionId: { type: String, required: true },
    driverRequired: { type: Boolean, required: true },
    rating: { type: Number, min: 1, max: 5 }, // Added rating field
    review: { type: String } // Added review field
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;



// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
//     bookedTimeSlots: {
//       from: { type: String ,required: true},
//       to: { type: String, required: true,}
//     },
//     totalHours: { type: Number, required: true},
//     totalAmount: { type: Number,required: true },
//     transactionId: { type: String,required: true },
//     driverRequired: { type: Boolean ,required: true, }
//   },
//   { timestamps: true }
// );

// const Booking = mongoose.model('Booking', bookingSchema);

// module.exports = Booking;
