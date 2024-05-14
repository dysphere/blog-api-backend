const Blogpost = require("../models/blogpost");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    const blogposts = await Blogpost.find({published: true}).populate("Author").sort({date_posted: -1}).exec();
    return res.status(200).json(blogposts);
});

exports.author_index = asyncHandler(async (req, res, next) => {
    const blogposts = await Blogpost.find().populate("Author").sort({date_posted: -1}).exec();
    return res.status(200).json(blogposts);
})

exports.blogpost_get = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId).populate("Author").exec();
    return res.status(200).json(blogpost);
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
    const blogauthor = await User.findOne({username: req.user.payload.username, role: req.user.payload.role});
    const blogpost = new Blogpost({
        author: blogauthor,
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
        date_posted: new Date(),
        published: !!req.body.published
    });
    await blogpost.save();
    return res.status(200).send("Blog post created");
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
            return res.status(200).send("Blog post updated");
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
        return res.status(200).send("Blog post deleted");
    }
    else {
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
});
