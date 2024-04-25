const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();

const author_controller = require('../controllers/authorController');
const blogpost_controller = require('../controllers/blogpostController');
const comment_controller = require('../controllers/commentController');
const commenter_controller = require('../controllers/commenterController');

//routes for looking at list of blog posts and at blog post itself
router.get('/', blogpost_controller.index);
router.get('/index', blogpost_controller.author_index);
router.get('/:postId', blogpost_controller.blogpost_get);
router.get('/:postId/comments', comment_controller.comments_get)

//routes for making and updating blog posts
router.post('/create-post', passport.authenticate('jwt', { session: false }), blogpost_controller.blogpost_create_post);
router.post('/:postId/update', passport.authenticate('jwt', { session: false }), blogpost_controller.blogpost_update_post);
router.post('/:postId/delete', passport.authenticate('jwt', { session: false }), blogpost_controller.blogpost_delete_post);

//routes for making comments to blog posts and replying to and liking other comments
router.post('/:postId/create-comment', passport.authenticate('jwt', { session: false }), comment_controller.comment_create_post);

router.post('/:postId/comment/:commentId/toggle-like', passport.authenticate('jwt', { session: false }), comment_controller.like_post);

router.post('/:postId/comment/:commentId/edit', passport.authenticate('jwt', { session: false }), comment_controller.comment_update_post);
router.post('/:postId/comment/:commentId/delete', passport.authenticate('jwt', { session: false }), comment_controller.comment_delete_post);

//routes for signing up and logging in commenters
router.post('/sign-up', commenter_controller.commenter_create_post);
router.post('/log-in', passport.authenticate('local', { session: false }), commenter_controller.commenter_login_post);

//routes for signing up and logging in authors
router.post('/author-sign-up', author_controller.author_create_post);
router.post('/author-log-in', passport.authenticate('local', { session: false }), author_controller.author_login_post);

module.exports = router;
