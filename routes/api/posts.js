const express = require('express');
const router = express.Router();

/*
 * @desc    Test posts route
 * @route   Get api/posts/test
 * @access  public
 */
router.get('/test', (req, res) => {
  res.json({ msg: 'Test Posts' });
});

module.exports = router;
