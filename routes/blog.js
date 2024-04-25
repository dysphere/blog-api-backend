const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();

const author_controller = require('../controllers/authorController');
const blogpost_controller = require('../controllers/blogpostController');
const comment_controller = require('../controllers/commentController');
const commenter_controller = require('../controllers/commenterController');

const authorization = (allowedRoles) => (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.sendStatus(403);
  }
  const token = authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.username = data.username;
    req.role = data.role;

    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

//routes for looking at list of blog posts and at blog post itself
router.get('/', blogpost_controller.index);
router.get('/:postId', blogpost_controller.blogpost_get);
router.get('/:postId/comments', comment_controller.comments_get)

//routes for making and updating blog posts
router.post('/create-post', authorization(["Author"]), blogpost_controller.blogpost_create_post);
router.post('/:postId/update', authorization(["Author"]), blogpost_controller.blogpost_update_post);
router.post('/:postId/delete', authorization(["Author"]), blogpost_controller.blogpost_delete_post);

//routes for making comments to blog posts and replying to and liking other comments
router.post('/:postId/create-comment', authorization(["Author", "Commenter"]), comment_controller.comment_create_post);

router.post('/:postId/comment/:commentId/toggle-like', authorization(["Author", "Commenter"]), comment_controller.like_post);

router.post('/:postId/comment/:commentId/edit', authorization(["Author", "Commenter"]), comment_controller.comment_update_post);
router.post('/:postId/comment/:commentId/delete', authorization(["Author", "Commenter"]), comment_controller.comment_delete_post);

//routes for signing up and logging in commenters
router.post('/sign-up', commenter_controller.commenter_create_post);
router.post('/log-in', commenter_controller.commenter_login_post);
router.post('/log-out', commenter_controller.commenter_logout_post)

//routes for signing up and logging in authors
router.post('/author-sign-up', author_controller.author_create_post);
router.post('/author-log-in', author_controller.author_login_post);
router.post('/author-log-out', author_controller.author_logout_post);

module.exports = router;
