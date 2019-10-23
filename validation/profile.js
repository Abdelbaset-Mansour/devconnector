const Validator = require('validator');
const isEmpty = require('./is-empty');

const profileValidation = data => {
  let errors = {};

  data.handel = !isEmpty(data.handel) ? data.handel : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Handel
  if (!Validator.isLength(data.handel, { min: 2, max: 40 })) {
    errors.handel = 'Handel field needs to be between 2 and 40 Character';
  }
  if (Validator.isEmpty(data.handel)) {
    errors.handel = 'Handel filed is required';
  }
  // Status
  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }
  // Skills
  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }
  // Website Url
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  // Social Media Check Url
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = profileValidation;
