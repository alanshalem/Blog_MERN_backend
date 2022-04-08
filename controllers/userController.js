const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Login & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
  }
});

// @desc    Create a user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = new User({
    username,
    password,
  });

  try {
    const savedUser = await user.save();
    return res.send(savedUser);
  } catch (error) {
    res.sendStatus(400).send(error);
    throw new Error("Invalid user data");
  }
});

module.exports = { getUsers, login, registerUser };
