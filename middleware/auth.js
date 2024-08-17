const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, 'jwt_secret');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin') return res.status(403).send('Access Denied');
  next();
};

module.exports = { authMiddleware, adminMiddleware };
