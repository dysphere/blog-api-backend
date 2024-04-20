const express = require('express');
const router = express.Router();

const author_controller = require('../controllers/authorController');
const blogpost_controller = require('../controllers/blogpostController');
const comment_controller = require('../controllers/commentController');
const commenter_controller = require('../controllers/commenterController');

//routes for looking at list of blog posts and at blog post itself
router.get('/', blogpost_controller.index);
router.get('/:postId', blogpost_controller.blogpost_get);

//routes for making and updating blog posts
router.get('/create-post', blogpost_controller.blogpost_create_get);
router.post('/create-post', blogpost_controller.blogpost_create_post);
router.get('/:postId/update', blogpost_controller.blogpost_update_get);
router.post('/:postId/update', blogpost_controller.blogpost_update_post);
router.get('/:postId/delete', blogpost_controller.blogpost_delete_get);
router.post('/:postId/delete', blogpost_controller.blogpost_delete_post);

//routes for making comments to blog posts and replying to and liking other comments
router.get('/:postId/create-comment', comment_controller.comment_create_get);
router.post('/:postId/create-comment', comment_controller.comment_create_post);

router.get('/:postId/comment/:commentId/reply', comment_controller.comment_reply_get);
router.post('/:postId/comment/:commentId/reply', comment_controller.comment_reply_post);
router.get('/:postId/comment/:commentId/toggle-like', comment_controller.like_get);
router.post('/:postId/comment/:commentId/toggle-like', comment_controller.like_post);

router.get('/:postId/comment/:commentId/edit', comment_controller.comment_update_get);
router.post('/:postId/comment/:commentId/edit', comment_controller.comment_update_post);
router.get('/:postId/comment/:commentId/delete', comment_controller.comment_delete_get);
router.post('/:postId/comment/:commentId/delete', comment_controller.comment_delete_post);

//routes for signing up and logging in commenters
router.get('/sign-up', commenter_controller.commenter_create_get);
router.post('/sign-up', commenter_controller.commenter_create_post);
router.get('/log-in', commenter_controller.commenter_login_get);
router.post('/log-in', commenter_controller.commenter_login_post);

//routes for signing up and logging in authors
router.get('/author-sign-up', author_controller.author_create_get);
router.post('/author-sign-up', author_controller.author_create_post);
router.get('/author-log-in', author_controller.author_login_get);
router.post('/author-log-in', author_controller.author_login_post);

module.exports = router;
