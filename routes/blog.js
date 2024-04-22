const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();

const author_controller = require('../controllers/authorController');
const blogpost_controller = require('../controllers/blogpostController');
const comment_controller = require('../controllers/commentController');
const commenter_controller = require('../controllers/commenterController');



//routes for looking at list of blog posts and at blog post itself
router.get('/', blogpost_controller.index);
router.get('/:postId', blogpost_controller.blogpost_get);
router.get('/:postId/comments', comment_controller.comments_get)

//routes for making and updating blog posts
router.post('/create-post', blogpost_controller.blogpost_create_post);
router.post('/:postId/update', blogpost_controller.blogpost_update_post);
router.post('/:postId/delete', blogpost_controller.blogpost_delete_post);

//routes for making comments to blog posts and replying to and liking other comments
router.post('/:postId/create-comment', comment_controller.comment_create_post);

router.post('/:postId/comment/:commentId/toggle-like', comment_controller.like_post);

router.post('/:postId/comment/:commentId/edit', comment_controller.comment_update_post);
router.post('/:postId/comment/:commentId/delete', comment_controller.comment_delete_post);

//routes for signing up and logging in commenters
router.post('/sign-up', commenter_controller.commenter_create_post);
router.post('/log-in', commenter_controller.commenter_login_post);
router.post('/log-out', commenter_controller.commenter_logout_post)

//routes for signing up and logging in authors
router.post('/author-sign-up', author_controller.author_create_post);
router.post('/author-log-in', author_controller.author_login_post);
router.post('/author-log-out', author_controller.author_logout_post);

module.exports = router;
