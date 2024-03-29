const Validator = require('validator');
const isEmpty = require('./is-empty');

const registerValidation = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  // Password2 === Confirm password
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Name
  if (!Validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = 'Name must be between 3 and 30 characters';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  // Email
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  // Password
  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  // Confirm password
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }
  if (!Validator.equals(data.password2, data.password)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = registerValidation;
