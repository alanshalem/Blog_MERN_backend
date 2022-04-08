const express = require("express");
const {
  login,
  registerUser,
  getUsers,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getUsers).post(registerUser);

router.post("/login", login);

module.exports = router;
