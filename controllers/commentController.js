const Blogpost = require('../models/blogpost');
const Comment = require('../models/comment');
const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.comments_get = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId).exec();
    const comments = await Comment.find({blog_post: blogpost}).populate("Blogpost").exec();
    res.json(comments);
});

exports.comment_create_post = [
    body("text", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    async (req, res, next) => {
        try {
        const blogpost = await Blogpost.findById(req.params.postId);
        const user = await User.findOne({user: req.username});
        const comment = new Comment({
            commenter: user,
            text: req.body.text,
            date_posted: new Date(),
            blog_post: blogpost,
            liked: []
        });
        await comment.save();
        }
        catch(err) {
            next(err);
        }

    }
];

exports.like_post = asyncHandler(async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate("User").exec();
        if (comment) {}
        else {}
    }
    catch(err) {
        next(err);
    }
});

exports.comment_update_post = [
    body("text", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.commentId).populate("User").exec();
            if (comment.commenter.username === req.username) {
                const update = {text: req.body.text, date_posted: new Date()};
                await Comment.findByIdAndUpdate(req.params.commentId, update).exec();
            }
            else {
                return res.status(403).json({ message: "Access denied: Unauthorized role" });
            }
        }
        catch(err) {
            next(err);
        }
    }
];

exports.comment_delete_post = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId).populate("User").exec();
    if (comment.commenter.username === req.username) {
        await Comment.findByIdAndDelete(req.params.commentId).exec();
    }
    else {
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
});