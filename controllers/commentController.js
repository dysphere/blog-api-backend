const Blogpost = require('../models/blogpost');
const Comment = require('../models/comment');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.comments_get = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId).exec();
    const comments = await Comment.find({blog_post: blogpost}).populate("Blogpost").exec();
    res.json(comments);
});

exports.comment_create_post = [];

exports.like_post = [];

exports.comment_update_post = [];

exports.comment_delete_post = [];