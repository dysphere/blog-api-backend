const Blogpost = require("../models/blogpost");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    const blogposts = await Blogpost.find({published: true}).populate("Author").sort({date_posted: -1}).exec();
    res.json(blogposts);
});

exports.author_index = asyncHandler(async (req, res, next) => {
    const blogposts = await Blogpost.find().populate("Author").sort({date_posted: -1}).exec();
    res.json(blogposts);
})

exports.blogpost_get = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId).populate("Author").exec();
    res.json(blogpost);
});


exports.blogpost_create_post = [
    body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tag", "Tag must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    const blogauthor = await User.findOne({username: req.user.payload.username});
    const blogpost = new Blogpost({
        author: blogauthor,
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
        date_posted: new Date(),
        published: !!req.body.published
    });
    await blogpost.save();
  }
];

exports.blogpost_update_post = [
    body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tag", "Tag must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  async (req, res, next) => {
    try {
        const blogpost = await Blogpost.findById(req.params.postId).populate("User").exec();
        if (blogpost.author.username === req.user.payload.username) {
            const update = {
                title: req.body.title,
                content: req.body.content,
                tag: req.body.tag,
                date_posted: new Date(),
                published: !!req.body.published
            }
            await Blogpost.findByIdAndUpdate(req.params.postId, update).populate("User").exec();
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

exports.blogpost_delete_post = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId).populate("User").exec();
    if (blogpost.author.username === req.user.payload.username) {
        await Blogpost.findByIdAndDelete(req.params.postId).exec();
    }
    else {
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
});
