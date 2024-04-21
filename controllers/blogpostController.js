const Blogpost = require("../models/blogpost");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    const blogposts = await Blogpost.find().populate("Author").sort({date_posted: -1}).exec();
    res.json(blogposts);
});

exports.blogpost_get = asyncHandler(async (req, res, next) => {
    const blogpost = await Blogpost.findById(req.params.postId).populate("Author").exec();
    res.json(blogpost);
});


exports.blogpost_create_post = [];

exports.blogpost_update_post = [];

exports.blogpost_delete_post = [];
