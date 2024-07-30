require('dotenv').config();

const { MONGODB_URI, PORT, SECRET_KEY } = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET_KEY
};
