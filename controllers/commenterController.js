const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

exports.username_get = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({username: req.user.payload.username});
  return res.status(200).json(user);
});

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
      const user = await User.findOne({username: req.body.username})
      if (!user) {
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
                  await user.save();
                  return res.status(200).send("User created");
            }
          });
      }
      else {
        throw new Error('User already exists' );
      }
    }
    catch(error) {
        next(error);
    }
  }
];

exports.commenter_login_post = function(req, res, next) {
  const token = jwt.sign({ username: req.user.username, role: "Commenter" }, process.env.JWT_SECRET, { expiresIn: '5h' });
  return res.status(200).json({ token });
};
