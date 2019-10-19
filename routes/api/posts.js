const express = require('express');
const router = express.Router();

// @route   Get api/posts/test
// @desc    Test posts route
// @access  public
router.get('/test', (req, res) => {
  res.json({ msg: 'Test Posts' });
});

module.exports = router;
