const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../config/verifyToken');

// User Model
const User = require('../../models/User');
// Secret Key JWT
const { secretKey } = require('../../config/keys');

// Load Validator
const registerValidation = require('../../validation/register');
const loginValidation = require('../../validation/login');

/*
 * @route   Get api/users/register
 * @desc    Register users route
 * @access  public
 */
router.post('/register', async (req, res) => {
  let { email, name, password } = req.body;
  // Validation
  const { errors, isValid } = registerValidation(req.body);

  if (!isValid) return res.status(400).json(errors);

  // Check if user is Exist
  const user = await User.findOne({ email });
  if (user) {
    errors.email = 'Email is already exist';
    return res.status(400).json(errors);
  }

  // Gravatar genrate
  const avatar = gravatar.url(email, {
    s: '200', // size
    r: 'pg', // Rating
    d: 'mm' // Default
  });

  const newUser = await User.create({
    name,
    email,
    password,
    avatar
  });
  // Hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      newUser.password = hash;
      // Saver user To db
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    });
  });
});

/*
 * @route   Get api/users/login
 * @desc    LogIn users route
 * @access  public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate data First
  const { errors, isValid } = loginValidation(req.body);

  if (!isValid) return res.status(400).json(errors);

  // Check for email
  const user = await User.findOne({ email });

  // if User Not Found in database
  if (!user) {
    errors.email = 'This email not found';
    return res.status(404).json(errors);
  }

  // If User found in db
  if (user) {
    // Check password
    bcrypt.compare(password, user.password, (err, success) => {
      if (success) {
        // user matched
        // Create JWT Payload
        const { _id, name, email } = user;
        const payload = { _id, name, email };

        // Sign Token
        const token = jwt.sign(payload, secretKey, {
          expiresIn: 86400 // expiresIn 1 day == 86400 Second
        });
        return res.json({
          token: `Bearer ${token}`
        });
      } else {
        errors.password = 'Invalid Password';
        return res.status(400).json(errors);
      }
    });
  }
});

/*
 * @route   GET api/users/current
 * @desc    Current users route
 * @access  Private
 */
router.get('/current', verifyToken, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    date: req.user.date
  });
});

module.exports = router;
