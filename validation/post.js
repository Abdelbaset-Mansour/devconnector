const Validator = require('validator');
const isEmpty = require('./is-empty');

const postValidation = data => {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  // text
  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Text field must be between 10 and 300 Chractares';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = postValidation;
