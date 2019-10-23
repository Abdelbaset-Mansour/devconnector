const jwt = require('jsonwebtoken');
const { secretKey } = require('./keys');

module.exports = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) return res.status(401).send('Access Denied!');
  const token = bearerToken.split(' ')[1];

  try {
    if (token) {
      const verified = jwt.verify(token, secretKey);
      req.user = verified;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
