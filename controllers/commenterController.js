const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

exports.commenter_create_post = [
    // Validate and sanitize fields.
  body("first_name", "First name must not be empty.")
  .trim()
  .isAlpha("en-US")
  .isLength({ min: 1 })
  .escape(),
body("last_name", "Last name must not be empty.")
  .trim()
  .isAlpha("en-US")
  .isLength({ min: 1 })
  .escape(),
body("username", "Username must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
body("password", "Password must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // if err, do something
            if (err) {
                return next(err);
            }
            // otherwise, store hashedPassword in DB
            else {
                const user = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    password: hashedPassword,
                    role: "Commenter"
                  });
                  const result = await user.save();
            }
          });
    }
    catch(error) {
        next(error);
    }
  }
];

exports.commenter_login_post = [
    
];

exports.commenter_logout_post = [];