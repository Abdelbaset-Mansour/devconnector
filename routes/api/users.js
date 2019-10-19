const express = require('express');
const router = express.Router();

// @route   Get api/users/test
// @desc    Test users route
// @access  public
router.get('/test', (req, res) => {
  res.json({ msg: 'Test Users' });
});

module.exports = router;
