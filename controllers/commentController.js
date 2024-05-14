const Blogpost = require('../models/blogpost');
const Comment = require('../models/comment');
const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.comments_get = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId);
    const comments = await Comment.find({blog_post: blogpost}).populate("commenter");
    return res.status(200).json(comments);
});

exports.comment_create_post = [
    body("text", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    async (req, res, next) => {
        try {
        const blogpost = await Blogpost.findById(req.params.postId);
        const user = await User.findOne({username: req.user.payload.username});
        const comment = new Comment({
            commenter: user,
            text: req.body.text,
            date_posted: new Date(),
            blog_post: blogpost,
            liked: []
        });
        await comment.save();
        return res.status(200).send("Comment created");
        }
        catch(err) {
            next(err);
        }

    }
];

exports.like_post = asyncHandler(async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate("liked");
        const user = await User.findOne({username: req.user.payload.username});
        const isLiked = comment.liked.some(id => id.equals(user._id));
        if (isLiked) {
            await Comment.updateOne({ _id: req.params.commentId }, { $pull: { liked: user._id } });
            return res.status(200).send("Like deleted");
        }
        else {
            await Comment.updateOne({ _id: req.params.commentId }, { $push: { liked: user._id } });
            return res.status(200).send("Like added");
        }
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
            const comment = await Comment.findById(req.params.commentId).populate("commenter");
            if (comment.commenter.username === req.user.payload.username) {
                const update = {text: req.body.text, date_posted: new Date()};
                await Comment.findByIdAndUpdate(req.params.commentId, update);
                return res.status(200).send("Comment updated");
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
    const comment = await Comment.findById(req.params.commentId).populate("commenter");
    if (comment.commenter.username === req.user.payload.username) {
        await Comment.findByIdAndDelete(req.params.commentId);
        return res.status(200).send("Comment deleted");
    }
    else {
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
});