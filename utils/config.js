
require('dotenv').config();

const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET
};

module.exports = config;


// require('dotenv').config();

// const { MONGODB_URI, PORT, SECRET_KEY,JWT_SECRET } = process.env;

// module.exports = {
//   MONGODB_URI,
//   PORT,
//   SECRET_KEY,
//   JWT_SECRET
// };
