const express = require('express');
const router = express.Router();
const verifyToken = require('../../config/verifyToken');

// Load Poifle Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// Load Validation
const profileValidation = require('../../validation/profile');
const experienceValidation = require('../../validation/experience');
const educationValidation = require('../../validation/education');

/*
 * @route   Get api/profile/
 * @desc    get current user profile
 * @access  Private
 */
router.get('/', verifyToken, (req, res) => {
  // Errors to push any error to this object
  const errors = {};

  Profile.findOne({ user: req.user._id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      // Check for profile
      if (!profile) {
        errors.noProfile = 'Ther is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

/*
 * @route   GET api/profile/all
 * @desc    get all profiles
 * @access  Public
 */
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find({})
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      // Check for profiles
      if (!profiles) {
        errors.noProfile = 'Ther is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(400).json(err));
});

/*
 * @route   GET api/profile/handel
 * @desc    get profile by handel
 * @access  Public
 */
router.get('/handel/:handel', (req, res) => {
  const errors = {};

  Profile.findOne({ handel: req.params.handel })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'there is no profile';
        return res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err => res.status(404).json(err));
});

/*
 * @route   GET api/profile/user/:user_id
 * @desc    get profile by user_id
 * @access  Public
 */
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'there is no profile';
        return res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

/*
 * @route   POST api/profile/
 * @desc    Create , Edit profile for current user
 * @access  Private
 */
router.post('/', verifyToken, (req, res) => {
  // Check validation
  const { errors, isValid } = profileValidation(req.body);

  // If validation errors
  if (!isValid) {
    // Return any errors with status code 400
    res.status(400).json(errors);
  }

  // Get Profile Fields
  const profileFields = {};
  profileFields.user = req.user._id;

  // Check and add fields to profile fields
  if (req.body.handel) profileFields.handel = req.body.handel;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;

  // skills split into array
  if (req.body.skills !== undefined) {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

  Profile.findOne({ user: req.user._id }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
    } else {
      // Create

      // Check for handel
      Profile.findOne({ handel: profileFields.handel }).then(profile => {
        if (profile) {
          errors.handel = 'That handel is exist';
          res.status(400).json(errors);
        } else {
          // Save profile into database
          new Profile(profileFields).save().then(profile => res.json(profile));
        }
      });
    }
  });
});

/*
 * @route   POST api/profile/experience
 * @desc    Create experience to profile
 * @access  Private
 */
router.post('/experience', verifyToken, (req, res) => {
  // Check validation
  const { errors, isValid } = experienceValidation(req.body);

  // If validation errors
  if (!isValid) {
    // Return any errors with status code 400
    res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user._id }).then(profile => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add to exp array
    profile.experience.unshift(newExp);
    profile.save().then(profile => res.json(profile));
  });
});

/*
 * @route   POST api/profile/education
 * @desc    Create education to profile
 * @access  Private
 */
router.post('/education', verifyToken, (req, res) => {
  // Check validation
  const { errors, isValid } = educationValidation(req.body);

  // If validation errors
  if (!isValid) {
    // Return any errors with status code 400
    res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user._id }).then(profile => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add to eduaction array
    profile.education.unshift(newEdu);
    profile.save().then(profile => res.json(profile));
  });
});

/*
 * @route   DELETE api/profile/experience
 * @desc    Delete experience from profile
 * @access  Private
 */
router.delete('/experience/:exp_id', verifyToken, (req, res) => {
  Profile.findOne({ user: req.user._id }).then(profile => {
    // Get remove index
    const removeIndex = profile.experience
      .map(item => item._id)
      .indexOf(req.params.exp_id);

    // Splice out of array
    profile.experience.splice(removeIndex, 1);

    // Save
    profile
      .save()
      .then(profile => res.json(profile))
      .catch(err => res.status(400).json(err));
  });
});

/*
 * @route   DELETE api/profile/education
 * @desc    Delete Education from profile
 * @access  Private
 */
router.delete('/education/:edu_id', verifyToken, (req, res) => {
  Profile.findOne({ user: req.user._id }).then(profile => {
    // Get remove index
    const removeIndex = profile.education
      .map(item => item._id)
      .indexOf(req.params.edu_id);

    // Splice out of array
    profile.education.splice(removeIndex, 1);

    // Save
    profile
      .save()
      .then(profile => res.json(profile))
      .catch(err => res.status(400).json(err));
  });
});

/*
 * @route   DELETE api/profile
 * @desc    Delete profile and user
 * @access  Private
 */
router.delete('/', verifyToken, (req, res) => {
  Profile.findOneAndRemove({ user: req.user._id }).then(() => {
    User.findOneAndRemove({ _id: req.user._id }).then(() =>
      res.json({ success: true })
    );
  });
});

module.exports = router;
