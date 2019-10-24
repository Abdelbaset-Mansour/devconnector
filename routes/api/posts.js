const express = require('express');
const router = express.Router();
const verifyToken = require('../../config/verifyToken');

// Load Post Model
const Post = require('../../models/Post');
// Load User Model
const User = require('../../models/User');

// Load Validation
const postValidation = require('../../validation/post');

/*
 * @route   Get api/posts/
 * @desc    get all posts
 * @access  public
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts));
});

/*
 * @route   Get api/posts/:id
 * @desc    get post by id
 * @access  public
 */
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.json(post);
      }
      res.status(404).json({ nopostfound: 'No post found' });
    })
    .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
});

/*
 * @route   POST api/posts
 * @desc    Create new post
 * @access  Privte
 */
router.post('/', verifyToken, (req, res) => {
  // Check post input data
  const { errors, isValid } = postValidation(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    user: req.user._id,
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar
  });

  // Save post
  newPost.save().then(post => res.json(post));
});

/*
 * @route   DELETE api/posts/:id
 * @desc    Delete post by id
 * @access  Private
 */
router.delete('/:id', verifyToken, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check post owner
      if (post.user.toString() !== req.user._id) {
        return res.status(401).json({ unauthorized: 'user not authorized' });
      }

      // Delete post from db
      post.remove().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ nopostfound: 'No post found' }));
});

/*
 * @route   POST api/posts/like/:id
 * @desc    Like post
 * @access  Private
 */
router.post('/like/:id', verifyToken, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check for like
      if (
        post.likes.filter(like => like.user.toString() === req.user._id)
          .length > 0
      ) {
        // this user is already liked this post
        return res
          .status(400)
          .json({ postisliked: 'This Post is already Liked by This User' });
      }
      // Add user id to likes array
      post.likes.unshift({ user: req.user._id });
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

/*
 * @route   POST api/posts/unlike/:id
 * @desc    Unlike post
 * @access  Private
 */
router.post('/unlike/:id', verifyToken, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check for like
      if (
        post.likes.filter(like => like.user.toString() === req.user._id)
          .length === 0
      ) {
        // this user is already liked this post
        return res
          .status(400)
          .json({ postnotliked: 'you not liked this post yet' });
      }
      // Get Romove Index
      const removeIndex = post.likes
        .map(item => item.user.toString())
        .indexOf(req.user._id);

      // Splice out of array
      post.likes.splice(removeIndex, 1);

      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

/*
 * @route   POST api/posts/comment/:id
 * @desc    Create comment for post
 * @access  Private
 */
router.post('/comment/:id', verifyToken, (req, res) => {
  const { errors, isValid } = postValidation(req.body);

  // Check Validation
  if (!isValid) {
    // Return any error with 400 status code
    return res.status(400).json(errors);
  }

  // find Post
  Post.findById(req.params.id)
    .then(post => {
      // New commnt
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user._id
      };
      // Add to Comments Array
      post.comments.unshift(newComment);
      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

/*
 * @route   POST api/posts/comment/:id/:comment_id
 * @desc    remove comment from post
 * @access  Private
 */
router.delete('/comment/:id/:comment_id', verifyToken, (req, res) => {
  // find Post
  Post.findById(req.params.id)
    .then(post => {
      // Check if Comment is not Exist
      if (
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ commentnotfound: 'This Comment not found' });
      }
      // Get Remove Index
      const removeIndex = post.comments
        .map(comment => comment._id)
        .indexOf(req.params.comment_id);

      // Splice comment from array
      post.comments.splice(removeIndex, 1);
      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No Post Found' }));
});

module.exports = router;
