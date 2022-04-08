const rateLimit = require("express-rate-limit");

const APILimiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});

module.exports = { APILimiter };
