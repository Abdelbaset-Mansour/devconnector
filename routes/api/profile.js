const express = require('express');
const router = express.Router();

// @route   Get api/profile/test
// @desc    Test profile route
// @access  Private
router.get('/test', (req, res) => {
  res.json({ msg: 'Test Profile' });
});

module.exports = router;
