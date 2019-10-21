const jwt = require('jsonwebtoken');
const { secretKey } = require('./keys');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) return res.status(401).send('Access Denied!');
  const token = bearerToken.split(' ')[1];

  try {
    if (token) {
      const verified = jwt.verify(token, secretKey);
      // GET User From db
      const user = await User.findById(verified._id);
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
