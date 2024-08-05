const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    bookedTimeSlots: {
      from: { type: String },
      to: { type: String }
    },
    totalHours: { type: Number },
    totalAmount: { type: Number },
    transactionId: { type: String },
    driverRequired: { type: Boolean },

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
