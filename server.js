
const express = require("express");
const mongoose = require("mongoose");
const carRoute = require("./routes/carsRoute");
const bookingRoute = require('./routes/bookingsRoute');
const usersRoute = require("./routes/usersRoute");
const cors = require('cors');
const stripe = require('stripe')('SECRET_KEY'); // Replace with your actual secret key
const moment = require('moment'); // Import the moment library

const { MONGODB_URI, PORT } = require("./utils/config");

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://capstonezoomcar-frnd.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());
app.use("/api/cars", carRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingRoute); // Correct the route path

app.post('/payment', async (req, res) => {
  try {
    // Create a payment session using Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [
        // Add relevant line items (e.g., product ID, quantity, etc.)
        // ...
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      customer_email: '', // Provide customer email
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });



// const express = require("express");
// const mongoose = require("mongoose");
// const carRoute = require("./routes/carsRoute");
// const bookingRoute = require('./routes/bookingsRoute');
// const usersRoute = require("./routes/usersRoute");
// const cors = require('cors');
// const stripe = require('stripe')('SECRET_KEY'); // Replace with your actual secret key
// const moment = require('moment'); // Import the moment library

// const { MONGODB_URI, PORT } = require("./utils/config");

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }));

// app.use(express.json());
// app.use("/api/cars", carRoute);
// app.use('/api/users', usersRoute);
// app.use('/api/bookings', bookingRoute); // Correct the route path
// app.post('/payment', async (req, res) => {
//   try {
//     // Create a payment session using Stripe
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         // Add relevant line items (e.g., product ID, quantity, etc.)
//         // ...
//       ],
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//       customer_email: '', // Provide customer email
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error('Error creating payment session:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB', error);
//   });
