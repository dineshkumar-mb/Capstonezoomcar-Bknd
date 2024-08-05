require('dotenv').config();

const { MONGODB_URI, PORT, SECRET_KEY,JWT_SECRET } = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET_KEY,
  JWT_SECRET
};
